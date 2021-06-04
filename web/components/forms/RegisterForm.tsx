const RegisterForm = (props: Props) => {
  const { id, name, children } = props;

  return (
    <div className="m-4 p-1">
      <form {...props}>
        <h1 className="text-2xl font-bold">{name ?? id}</h1>
        {children}
      </form>
    </div>
  );
};

export default RegisterForm;
