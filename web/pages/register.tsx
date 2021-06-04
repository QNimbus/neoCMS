import Layout from "../components/Layout";
import RegisterForm from "../components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <Layout title="Register | NeoCMS">
      <RegisterForm id="RegisterForm" name="Register">
        <div className="mb-4 mt-6">
          <label htmlFor="email" className="block mb-2 text-gray-600 text-sm font-semibold">
            e-mail
          </label>
          <input
            id="email"
            type="text"
            placeholder="john@doe.com"
            className="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10"
          />
        </div>
        <div className="mb-4 mt-6">
          <label htmlFor="password" className="block mb-2 text-gray-600 text-sm font-semibold">
            password
          </label>
          <input
            id="password"
            type="password"
            placeholder="password"
            className="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10"
          />
        </div>
      </RegisterForm>
    </Layout>
  );
}
