import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../axiosConfig.js";

const Register = () => {

    const navigate = useNavigate();

    const [dataForm, setDataForm] = useState({
        name: '',
        mail: '',
        password: '',
        phone: '',
        domicile: {
            cp: "",
            calle: "",
            numeroExt: "",
            colonia: "",
            ciudad: "",
            municipio: "",
            estado: ""
        },
        rfc: '',
        rf: ''
    });

    return (
        <h1>Register</h1>
    );
    
}

export default Register;