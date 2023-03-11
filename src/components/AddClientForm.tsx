import React, {useRef} from 'react';
import Client from '../models/Client';
import IP from '../models/IPObj';

interface Props{
    clients:Client[];
    onSetClients: React.Dispatch<React.SetStateAction<Client[]>>;
    onFinish: Function;
}

const AddClientForm = ({clients, onSetClients, onFinish}:Props)=>{

    const nameRef = useRef<HTMLInputElement>(null);
    const genderRef = useRef<HTMLInputElement>(null);
    const ageRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const addClient = (name: string, gender: string, age: string, email: string) => {
        const newClients = [...clients,
        { name: name , gender: gender, age: age, email: email } as Client,
        ];
        onSetClients(newClients);
        
    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //addClient(nameRef.current?.value as string, genderRef.current?.value as string, ageRef.current?.value as string, emailRef.current?.value as string)
        await fetch(`http://${IP.ip_laptop}:4200/newClient`, {
            method: 'POST',
            
            headers : {
                'x-access-token': localStorage.getItem("token") + "",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: nameRef.current?.value, gender: genderRef.current?.value, age: ageRef.current?.value, email: emailRef.current?.value} as Client)
        }).then(()=>console.log('hello'))
        .catch(err=> console.log('error'))

        await onFinish();
        document.querySelectorAll('input').forEach(currInput=> currInput.value = '');
    }
    return (

            <div>
                <h1 className='d-flex justify-content-center'>
                    Añadir nuevo cliente
                </h1>
                <div className='d-flex justify-content-center'>
                    <form id="addForm" onSubmit={(e) => submit(e)}>
                        Nombre:
                        <br/>
                        <input style={{width: '17rem'}}className='form-control' type={'text'} ref={nameRef}></input>
                        <br/>
                        Genero:
                        <br/>
                        <input style={{width: '17rem'}}className='form-control' type={'text'} ref={genderRef}></input>
                        <br/>
                        Edad:
                        <br/>
                        <input style={{width: '17rem'}}className='form-control' type={'text'} ref={ageRef}></input>
                        <br/>
                        Correo:
                        <br/>
                        <input style={{width: '17rem'}}className='form-control' type={'text'} ref={emailRef}></input>
                        <br/>
                        <button className="btn btn-primary"type='submit'>Enviar</button>
                    </form>
                </div>
            </div>
    );
}

export default AddClientForm;