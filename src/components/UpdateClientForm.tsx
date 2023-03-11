import React, { useRef } from 'react';
import Client from '../models/Client';
import { createPortal } from 'react-dom';
import IP from '../models/IPObj';

type EditClient = {
    client: Client | null;
    isOpen: boolean;
}

interface Props  {
    clients: Client[];
    setClients: Dispatcher<Client[]>;
    editClient: EditClient;
    setEditClient: Dispatcher<EditClient>;
    onFinish: Function;
}

const FORMS_STYLE: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "#FFF",
    padding: '50px',
    zIndex: 1000,
    borderRadius : '12px'
}

const OVERLAY_STYLES: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.4)'
}

type Dispatcher<T> = React.Dispatch<React.SetStateAction<T>>

const UpdateClientForm = ({clients, setClients, editClient, setEditClient, onFinish}:Props) => {
    console.log(editClient.client);
    const updateClient = (client: Client,
        name: string,
        gender: string,
        age: string,
        email: string) => {
        const newClients = clients.map((currClient, i) => {
            if (currClient == client) {

                return { name: name, gender: gender, age: age, email: email } as Client;
            }
            return currClient;
        });
        setClients([...newClients]);
    }
    var nameRef = useRef<HTMLInputElement>(null);
    var genderRef = useRef<HTMLInputElement>(null);
    var ageRef = useRef<HTMLInputElement>(null);
    var emailRef = useRef<HTMLInputElement>(null);
    

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //updateClient(editClient.client as Client,
            //nameRef.current?.value as string,
            //genderRef.current?.value as string,
            //ageRef.current?.value as string,
            //emailRef.current?.value as string
        //);
        await fetch(`http://${IP.ip_laptop}:4200/updateClient/${editClient.client?.id}`,{
            method: 'PUT',
            headers : {
                'x-access-token': localStorage.getItem("token") + "",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: nameRef.current?.value, gender: genderRef.current?.value, age: ageRef.current?.value, email: emailRef.current?.value})
        })
        await onFinish();
        setEditClient({client:null, isOpen: false});
    }

    const closeFun = ()=>{
        setEditClient({client:null, isOpen: false});
    }
    return createPortal(
        <div style={OVERLAY_STYLES}>
            <div style={FORMS_STYLE}>
                <h1>
                    Editar Cliente
                </h1>
                <form onSubmit={submit}>
                    Nombre:
                    <br />
                    <input ref={nameRef} type='text' className='form-control' placeholder={editClient.client?.name}></input>
                    <br />
                    Genero:
                    <br />
                    <input ref={genderRef} type='text' className='form-control' placeholder={editClient.client?.gender} ></input>
                    <br />
                    Edad:
                    <br />
                    <input ref={ageRef} type='text' className='form-control' placeholder={editClient.client?.age} ></input>
                    <br />
                    Email:
                    <br />
                    <input ref={emailRef} type='text' className='form-control' placeholder={editClient.client?.email} ></input>
                    <br />
                    <br/>
                    <button className="btn btn-primary" type='submit'>Guardar</button>
                    <button style={{margin: "10px"}} className='btn btn-danger' onClick={closeFun}>Cerrar</button>
                </form>
            </div>

        </div>, document.getElementById('portal') as Element | DocumentFragment
    );
}

export default UpdateClientForm;