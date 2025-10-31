import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [dataForm, setDataForm] = useState({
    mail: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', dataForm);
      console.log("Login exitoso");
      navigate('/home');
    } catch (error) {
      setDataForm({
        mail: '',
        password: ''
      });
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[url(/mountains.jpg)] bg-cover p-4">
      <section className="flex flex-col gap-4 rounded-2xl bg-gray-400/95 p-15 w-full max-w-md">
        <h1 className="text-center font-semibold text-2xl">Inicio de sesión</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mail">Correo:</Label>
            <Input
              type="text"
              id="mail"
              value={dataForm.mail}
              className="bg-gray-300"
              onChange={
                (e) => {
                  setDataForm({
                    ...dataForm,
                    mail: e.target.value
                  });
                }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña:</Label>
            <Input
              type="password"
              id="password"
              value={dataForm.password}
              className="bg-gray-300"
              onChange={
                (e) => {
                  setDataForm({
                    ...dataForm,
                    password: e.target.value
                  });
                }}
            />
          </div>

          {error && (
            <Label className="text-red-500 font-bold">{error}</Label>
          )}

          <Button
            variant="default"
            type="submit"
            className="rounded-full mt-1"
            disabled={isLoading || !dataForm.mail || !dataForm.password}
          >Ingresar</Button>

          <p>¿Aún no tienes una cuenta? <NavLink to="/register" className={"font-semibold hover:underline"}>Regístrate aquí.</NavLink></p>
        </form>
      </section>
    </main>
  )
}

export default Login