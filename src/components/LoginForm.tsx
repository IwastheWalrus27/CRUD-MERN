import React, {useState, useRef} from 'react'
import { createPortal } from 'react-dom'
import ServerAddress from '../models/ServerAddress'; 

const FORMS_STYLE: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "#FFF",
    padding: '50px',
    zIndex: 2000,
    borderRadius : '12px'
}

const OVERLAY_STYLES: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.4)'
}
interface Props{
    onDone : Dispatcher<boolean>;
    setToken: Dispatcher<string>
}
type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>

const LoginForm = ({onDone, setToken}:Props )=>{
    const [isBlocked, setISBlocked] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const pswdRef = useRef<HTMLInputElement>(null);
    const submit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const serverRes = await fetch(`http://${ServerAddress.full_address}/auth`, {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: nameRef.current?.value, password: pswdRef.current?.value})
        });
        //Se pondra onDone false unicamente si el usuario es el adecuado
        //en base a la respuesta del servidor
        //Si la respuesta del servidor dice que el usuario no es correcto
        //entonces deberiamos seguir mostrando el forms de inciar sesion
        const serverData = await serverRes.json();
        if(serverData.status == 200){
            console.log(serverData.token);
            localStorage.setItem("token", serverData.token);
            setToken(serverData.token);
            onDone(false);
        }
        if(serverData.status = 401){
            setISBlocked(true);
        }
        
    }
    return createPortal(
        <div style={OVERLAY_STYLES}>
            <form style={FORMS_STYLE} onSubmit={e=>submit(e)}>
                <h1>
                    Inicia sesión
                </h1>
                Nombre:
                <input ref={nameRef} className='form-control'></input>
                Contraseña:
                <input type="password"ref={pswdRef} className='form-control'></input>
                <br/>
                {!isBlocked? null : <p className='text-danger'>Usuario y contraseña incorrectos</p>}
                <button className='btn btn-primary'type='submit'>Iniciar Sesión</button>
            </form>
        </div>, document.getElementById('login-portal') as Element | DocumentFragment

    );
}

export default LoginForm;