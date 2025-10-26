import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const { signIn, user } = useAuth();
  console.log(user);

  const location = useLocation();
  const navigate = useNavigate();
  console.log(location);
  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((userCredential) => {
        console.log(
          "Sign-in promise resolved. User credential:",
          userCredential.user
        );

        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Login Error:", error);
      });
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="font-bold">Login with Profast</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-600">Email is required</p>}

            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-600">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-600">
                Password must be at least 6 characters
              </p>
            )}

            <p className="mt-2 text-sm">
              <Link className="text-[#8FA748]" to="/forgot-password">
                Forgot Password?
              </Link>
            </p>
            <button
              className="btn bg-[#CAEB66] mt-4 text-black w-full"
              type="submit"
            >
              Login
            </button>
          </fieldset>

          <p className="mt-4 text-sm">
            Don't have an account?{" "}
            <Link className="text-[#8FA748] btn btn-link" to="/register">
              Register
            </Link>
          </p>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Login;
