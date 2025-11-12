import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../components/ui/separator.jsx";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../axiosConfig.js";
import { EyeIcon, EyeOffIcon, Loader2, AlertCircleIcon } from 'lucide-react';
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [dataForm, setDataForm] = useState({
    mail: '',
    password: ''
  });

  const togglePasswordVisibility = () => setIsPasswordVisible(prevState => !prevState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('/auth/login', dataForm);
      navigate('/home');
    } catch (error) {
      setDataForm({
        mail: '',
        password: ''
      });
      setError(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = dataForm.mail && dataForm.password;

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[url(/mountains.jpg)] bg-cover bg-center p-6">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-4">
          <CardTitle className="font-bold text-2xl text-gray-800">
            Iniciar Sesión
          </CardTitle>
          <p className="text-sm text-gray-600">
            Ingresa a tu cuenta para continuar
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-3">
              <Label htmlFor="mail" className="text-gray-700 font-medium">
                Correo electrónico
              </Label>
              <Input
                type="email"
                id="mail"
                value={dataForm.mail}
                className="bg-white border-gray-300 focus:border-blue-500 transition-colors"
                onChange={(e) => setDataForm({ ...dataForm, mail: e.target.value })}
                placeholder="tu@correo.com"
                disabled={isLoading}
              />
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={dataForm.password}
                  className="bg-white border-gray-300 focus:border-blue-500 pr-10 transition-colors"
                  onChange={(e) => setDataForm({ ...dataForm, password: e.target.value })}
                  placeholder="Ingresa tu contraseña"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 h-full px-3 hover:bg-transparent"
                >
                  {isPasswordVisible ?
                    <EyeOffIcon className="h-4 w-4 text-gray-500" /> :
                    <EyeIcon className="h-4 w-4 text-gray-500" />
                  }
                </Button>
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <Alert variant="destructive" className="bg-red-50 border border-red-200 rounded-lg">
                <AlertCircleIcon />
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}

            {/* Botón de Login */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
          </form>
        </CardContent>

        <Separator className="my-2" />

        <CardFooter className="flex justify-center pt-4">
          <p className="text-sm text-gray-600 text-center">
            ¿Aún no tienes una cuenta?{' '}
            <NavLink
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Regístrate aquí
            </NavLink>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

export default Login;