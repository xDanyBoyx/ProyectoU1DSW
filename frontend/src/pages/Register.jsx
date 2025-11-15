import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardFooter,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "../components/ui/separator.jsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, ArrowLeft, ArrowRight, Loader2, AlertCircleIcon, CheckCircle2, X } from 'lucide-react'
import { capitalizeFirstLetter } from '../lib/utils.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "../axiosConfig.js";
import CustomToast from '../components/CustomToast.jsx';
import {
    Alert,
    AlertTitle,
    AlertDescription
} from "@/components/ui/alert";

const Register = () => {

    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [currentTab, setCurrentTab] = useState("personal");
    const togglePasswordVisibility = () => setIsPasswordVisible(prevState => !prevState);

    const [isLoading, setIsLoading] = useState(false);

    const [estados, setEstados] = useState([]);
    const [municipiosPorEstado, setMunicipiosPorEstado] = useState({});
    const [regimenesFiscales, setRegimenesFiscales] = useState([]);
    const [errors, setErrors] = useState([]);
    const [usuarioCreado, setUsuarioCreado] = useState(false);

    const [dataForm, setDataForm] = useState({
        name: '',
        mail: '',
        password: '',
        phone: '',
        domicile: {
            cp: '',
            calle: '',
            numeroExt: '',
            colonia: '',
            ciudad: '',
            municipio: '',
            estado: ''
        },
        rfc: '',
        rf: ''
    });

    const municipios =
        municipiosPorEstado[
        Object.keys(municipiosPorEstado).find(
            (key) => key.toLowerCase() === dataForm.domicile.estado?.toLowerCase()
        )
        ] || [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resEstados = await fetch('/data/estados.json');
                const resMunicipios = await fetch('/data/estados-municipios.json');
                const resRegimenesFiscales = await fetch('/data/regimenes-fiscales.json');

                const dataEstados = await resEstados.json();
                const dataMunicipios = await resMunicipios.json();
                const dataRegimenesFiscales = await resRegimenesFiscales.json();

                setEstados(dataEstados);
                setMunicipiosPorEstado(dataMunicipios);
                setRegimenesFiscales(dataRegimenesFiscales);
            } catch (error) {
                console.error(error);
                setEstados([]);
                setMunicipiosPorEstado({});
                setRegimenesFiscales([]);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsuarioCreado(false);
        if (!isLastTab) {
            nextTab(); // Ir a la siguiente tab si no es la última
            return;
        }
        setIsLoading(true);
        try {
            await axios.post('/auth/register', dataForm);
            setUsuarioCreado(true);
            setTimeout(() => {
                navigate('/'); // navegar a la página de inicio de sesión
            }, 3000);
        } catch (error) {
            const respuesta = error.response.data;
            if (respuesta.errors) {
                setErrors(respuesta.errors);
                return;
            }
            const errorMessage = respuesta.message || 'Ocurrió un error inesperado.';
            toast.custom((t) => (
                <CustomToast
                    t={t}
                    type="error"
                    title="Error de registro"
                    message={errorMessage}
                />
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: "personal", label: "Información Personal" },
        { id: "fiscal", label: "Datos Fiscales" },
        { id: "domicilio", label: "Domicilio" }
    ];

    const nextTab = () => {
        const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
        if (currentIndex < tabs.length - 1) {
            setCurrentTab(tabs[currentIndex + 1].id);
        }
    };

    const prevTab = () => {
        const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
        if (currentIndex > 0) {
            setCurrentTab(tabs[currentIndex - 1].id);
        }
    };

    const isLastTab = currentTab === tabs[tabs.length - 1].id;
    const isFirstTab = currentTab === tabs[0].id;

    // const isFormValid = dataForm.name && dataForm.mail && dataForm.password && dataForm.phone &&
    //     dataForm.domicile.cp && dataForm.domicile.calle && dataForm.domicile.numeroExt &&
    //     dataForm.domicile.colonia && dataForm.domicile.ciudad && dataForm.domicile.municipio &&
    //     dataForm.domicile.estado && dataForm.rfc && dataForm.rf;

    return (
        <main className="flex min-h-svh flex-col items-center justify-center bg-[url(/mountains.jpg)] bg-cover p-4">
            <Card className="w-full max-w-md bg-white/95 border-0 shadow-xl">
                <CardHeader className="text-center pb-4">
                    <CardTitle className="font-bold text-2xl text-gray-800">Regístrate</CardTitle>
                    <p className="text-sm text-gray-600">Completa tu información en los siguientes pasos</p>
                </CardHeader>

                <CardContent>
                    {/* Progress Indicator */}
                    <div className="flex justify-between items-center mb-6 px-2">
                        {tabs.map((tab, index) => (
                            <div key={tab.id} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium 
                                        ${currentTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : index < tabs.findIndex(t => t.id === currentTab)
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-300 text-gray-600'
                                    }`}
                                >
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                        <TabsList className="grid grid-cols-3 mb-6">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="text-xs truncate"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Información Personal */}
                        <TabsContent value="personal" className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name" className="text-gray-700">Nombre completo <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        value={dataForm.name}
                                        className="bg-white border-gray-300 focus:border-blue-500"
                                        onChange={(e) => setDataForm({ ...dataForm, name: e.target.value })}
                                        placeholder="Ingresa tu nombre completo"
                                    />
                                    {errors.name && (
                                        <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.name}`}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="mail" className="text-gray-700">Correo electrónico <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="email"
                                        id="mail"
                                        value={dataForm.mail}
                                        className="bg-white border-gray-300 focus:border-blue-500"
                                        onChange={(e) => setDataForm({ ...dataForm, mail: e.target.value })}
                                        placeholder="ejemplo@correo.com"
                                    />
                                    {errors.mail && (
                                        <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.mail}`}</span>
                                    )}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="password" className="text-gray-700">Contraseña <span className="text-red-500">*</span></Label>
                                    <div className='relative'>
                                        <Input
                                            id="password"
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            value={dataForm.password}
                                            className="bg-white border-gray-300 focus:border-blue-500 pr-10"
                                            onChange={e => setDataForm({ ...dataForm, password: e.target.value })}
                                            placeholder="Crea una contraseña segura"
                                        />
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='icon'
                                            onClick={togglePasswordVisibility}
                                            className='absolute inset-y-0 right-0 h-full px-3 hover:bg-transparent'
                                        >
                                            {isPasswordVisible ?
                                                <EyeOffIcon className="h-4 w-4 text-gray-500" /> :
                                                <EyeIcon className="h-4 w-4 text-gray-500" />
                                            }
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.password}`}</span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="phone" className="text-gray-700">Teléfono <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="tel"
                                        id="phone"
                                        value={dataForm.phone}
                                        className="bg-white border-gray-300 focus:border-blue-500"
                                        onChange={(e) => setDataForm({ ...dataForm, phone: e.target.value })}
                                        placeholder="XXX-XXX-XXXX"
                                    />
                                    {errors.phone && (
                                        <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.phone}`}</span>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Datos Fiscales */}
                        <TabsContent value="fiscal" className="space-y-4">
                            <div className="space-y-4">
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="rfc" className="text-gray-700">RFC <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="text"
                                        id="rfc"
                                        value={dataForm.rfc}
                                        className="bg-white border-gray-300 focus:border-blue-500"
                                        onChange={(e) => setDataForm({ ...dataForm, rfc: e.target.value })}
                                        placeholder="Ingresa tu RFC"
                                        maxLength={13}
                                    />
                                    {errors.rfc && (
                                        <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.rfc}`}</span>
                                    )}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="rf" className="text-gray-700">Régimen fiscal <span className="text-red-500">*</span></Label>
                                    <Select
                                        onValueChange={(value) => setDataForm({ ...dataForm, rf: value })}
                                        value={dataForm.rf}
                                    >
                                        <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 w-full">
                                            <SelectValue placeholder="Seleccione un régimen fiscal" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {regimenesFiscales.map((regimen) => (
                                                    <SelectItem key={regimen.clave} value={regimen.clave}>
                                                        {regimen.descripcion}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.rf && (
                                        <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.rf}`}</span>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Domicilio */}
                        <TabsContent value="domicilio" className="space-y-4">
                            <div className="space-y-4">
                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="cp" className="text-gray-700">Código postal <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="text"
                                        id="cp"
                                        value={dataForm.domicile.cp}
                                        className="bg-white border-gray-300 focus:border-blue-500"
                                        onChange={(e) => setDataForm({
                                            ...dataForm,
                                            domicile: { ...dataForm.domicile, cp: e.target.value }
                                        })}
                                        placeholder="00000"
                                        maxLength={5}
                                    />
                                    {errors.domicile_cp && (
                                        <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.domicile_cp}`}</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor="calle" className="text-gray-700">Calle <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="text"
                                            id="calle"
                                            value={dataForm.domicile.calle}
                                            className="bg-white border-gray-300 focus:border-blue-500"
                                            onChange={(e) => setDataForm({
                                                ...dataForm,
                                                domicile: { ...dataForm.domicile, calle: e.target.value }
                                            })}
                                            placeholder="Nombre de la calle"
                                        />
                                        {errors.domicile_calle && (
                                            <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.domicile_calle}`}</span>
                                        )}
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor="numeroExt" className="text-gray-700">Número exterior <span className="text-red-500">*</span></Label>
                                        <Input
                                            type="text"
                                            id="numeroExt"
                                            value={dataForm.domicile.numeroExt}
                                            className="bg-white border-gray-300 focus:border-blue-500"
                                            onChange={(e) => setDataForm({
                                                ...dataForm,
                                                domicile: { ...dataForm.domicile, numeroExt: e.target.value }
                                            })}
                                            placeholder="123"
                                        />
                                        {errors.domicile_numeroExt && (
                                            <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.domicile_numeroExt}`}</span>
                                        )}
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="colonia" className="text-gray-700">Colonia <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="text"
                                        id="colonia"
                                        value={dataForm.domicile.colonia}
                                        className="bg-white border-gray-300 focus:border-blue-500"
                                        onChange={(e) => setDataForm({
                                            ...dataForm,
                                            domicile: { ...dataForm.domicile, colonia: e.target.value }
                                        })}
                                        placeholder="Nombre de la colonia"
                                    />
                                    {errors.domicile_colonia && (
                                        <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.domicile_colonia}`}</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className='flex flex-col gap-2'>
                                        <Label htmlFor="estado" className="text-gray-700">Estado <span className="text-red-500">*</span></Label>
                                        <Select
                                            onValueChange={(value) => setDataForm({
                                                ...dataForm,
                                                domicile: { ...dataForm.domicile, estado: value }
                                            })}
                                            value={dataForm.domicile.estado}
                                        >
                                            <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 w-full">
                                                <SelectValue placeholder="Selecciona estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {estados.map((estado) => (
                                                        <SelectItem key={estado.clave} value={estado.nombre}>
                                                            {capitalizeFirstLetter(estado.nombre)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.domicile_estado && (
                                            <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.domicile_estado}`}</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="municipio" className="text-gray-700">Municipio <span className="text-red-500">*</span></Label>
                                        <Select
                                            onValueChange={(value) => setDataForm({
                                                ...dataForm,
                                                domicile: { ...dataForm.domicile, municipio: value }
                                            })}
                                            disabled={!dataForm.domicile.estado}
                                            value={dataForm.domicile.municipio}
                                        >
                                            <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500 w-full">
                                                <SelectValue placeholder={"Selecciona municipio"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {municipios.map((municipio, index) => (
                                                        <SelectItem key={index} value={municipio}>
                                                            {municipio}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.domicile_municipio && (
                                            <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.domicile_municipio}`}</span>
                                        )}
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label htmlFor="ciudad" className="text-gray-700">Ciudad <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="text"
                                        id="ciudad"
                                        value={dataForm.domicile.ciudad}
                                        className="bg-white border-gray-300 focus:border-blue-500"
                                        onChange={(e) => setDataForm({
                                            ...dataForm,
                                            domicile: { ...dataForm.domicile, ciudad: e.target.value }
                                        })}
                                        placeholder="Nombre de la ciudad"
                                    />
                                    {errors.domicile_ciudad && (
                                        <span className="ml-1 font-normal text-xs text-red-500">{`• ${errors.domicile_ciudad}`}</span>
                                    )}
                                </div>


                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Mensaje de Error */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="bg-red-50 border border-red-200 rounded-lg mt-4">
                            <AlertCircleIcon />
                            <AlertTitle>Errores en el formulario, por favor reviselos.</AlertTitle>
                        </Alert>
                    )}

                    {usuarioCreado && (
                        <Alert className="bg-emerald-50 border border-emerald-200 rounded-lg mt-4 text-center">
                            <AlertTitle className="text-emerald-800 font-semibold flex gap-2 items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                <span>¡Usuario creado exitosamente!</span>
                            </AlertTitle>
                            <AlertDescription className="text-emerald-700 mt-1">
                                Tu registro se ha completado correctamente. Redirigiendo a la página de inicio de sesión...
                                <div className="flex justify-center mt-2 w-full">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevTab}
                            disabled={isFirstTab}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Anterior
                        </Button>

                        {isLastTab ? (
                            <Button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                disabled={isLoading}
                            // disabled={!isFormValid}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Guardando...
                                    </>
                                ) : (
                                    'Completar registro'
                                )}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={nextTab}
                                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                            >
                                Siguiente
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>

                <Separator className="" />

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600 text-center">
                        ¿Ya tienes una cuenta?{' '}
                        <NavLink
                            to="/"
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                            Inicia sesión aquí
                        </NavLink>
                    </p>
                </CardFooter>
            </Card>
        </main>
    );
}

export default Register;