/**
 * @module resolvers
 */

// Dependencies
import bcrypt from 'bcryptjs';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

// Local dependencies
import config from '../../../config';
import { redisClient } from '../../../redis';
import { sendMail } from '../../../utils/sendMail';
import { User } from '../../entities/User';
import { RegisterInput } from '../inputtypes/RegisterInput';
import { LoginInput } from '../inputtypes/LoginInput';
import { IsLoggedIn } from '../../../graphql/middleware/isLoggedIn';
import { ForgotPasswordInput } from '../inputtypes/ForgotPasswordInput';
import { ResetPasswordInput } from '../inputtypes/ResetPasswordInput';
import { createTokenUrl } from '../../../utils/createTokenUrl';
import { createTokens } from '../../../utils/createTokens';
import { sendRefreshToken } from '../../../utils/sendRefreshToken';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @IsLoggedIn()
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: IApiContext): Promise<User | undefined> {
    // Try to get user from Request object (set by custom middleware from JWT cookie)
    if (!req.user) {
      return undefined;
    }

    const { id: userId } = req.user;

    // Try to return user
    return User.findOne(userId);
  }

  @Query(() => [User])
  @IsLoggedIn()
  async users(): Promise<User[]> {
    return User.find();
  }

  @IsLoggedIn(false)
  @Mutation(() => User)
  async register(
    @Arg('data') { email, password, firstName, lastName }: RegisterInput
  ): Promise<User> {
    const hashedPassword = bcrypt.hashSync(password, config.passwordHashSalt);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    }).save();

    await sendMail(
      user.email,
      await createTokenUrl(user.id, TokenUrlType.CONFIRM_EMAIL, {
        expires: '24 hours',
      })
    );

    return user;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('data') { email, password }: LoginInput,
    @Ctx() { res }: IApiContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user || !user.confirmed) {
      throw new Error('Unable to login');
    }

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      throw new Error('Unable to login');
    }

    // Invalidate current refresh-token
    await user.invalidateRefreshToken();

    // Create new JWT strings
    const { accessToken, refreshToken } = createTokens(user);

    // Set a cookie with the refresh token
    sendRefreshToken(res, refreshToken);

    // Return new access token
    return {
      accessToken,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() context: IApiContext): Promise<Boolean> {
    return new Promise((res, rej) => {
      try {
        // Clear JWT tokens from cookie
        context.res.clearCookie(config.jwtConfig.refreshTokenCookie);

        return res(true);
      } catch (err) {
        return rej(err);
      }
    });
  }

  @IsLoggedIn(false)
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('data') { email, expires }: ForgotPasswordInput
  ): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    sendMail(
      user.email,
      await createTokenUrl(user.id, TokenUrlType.RESET_PASSWORD, { expires })
    );
    return true;
  }

  @IsLoggedIn(false)
  @Mutation(() => User, { nullable: true })
  async resetPassword(
    @Arg('data') { token, password }: ResetPasswordInput
  ): Promise<User | null> {
    const userId = await redisClient.get(
      `${TokenUrlType.RESET_PASSWORD}_${token}`
    );

    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    user.password = bcrypt.hashSync(password, config.passwordHashSalt);
    await user.save();

    // Clear redis token
    await redisClient.del(`${TokenUrlType.RESET_PASSWORD}_${token}`);

    return user;
  }

  @IsLoggedIn(false)
  @Mutation(() => Boolean)
  async confirmEmail(@Arg('token') token: string): Promise<Boolean> {
    const userId = await redisClient.get(
      `${TokenUrlType.CONFIRM_EMAIL}_${token}`
    );

    if (!userId) {
      return false;
    }

    // Confirm user email
    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });

    // Clear redis token
    await redisClient.del(`${TokenUrlType.CONFIRM_EMAIL}_${token}`);

    return true;
  }
}
