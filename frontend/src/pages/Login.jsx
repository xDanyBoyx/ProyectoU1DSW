import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../components/ui/separator.jsx";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../axiosConfig.js";

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
      const response = await axios.post('/auth/login', dataForm);
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
      <Card className="w-full max-w-sm bg-gray-400/95 border-0">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Inicio de sesión</CardTitle>
        </CardHeader>
        <CardContent>
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

          </form>
        </CardContent>

        <Separator/>

        <CardFooter>
          <p>¿Aún no tienes una cuenta? <NavLink to="/register" className={"font-semibold hover:underline"}>Regístrate aquí.</NavLink></p>
        </CardFooter>

      </Card>
    </main>
  )
}

export default Login