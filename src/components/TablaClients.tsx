import React, { useState, useRef, useEffect } from 'react';
import Client from '../models/Client';
import AddClientForm from './AddClientForm';
import UpdateClientForm from './UpdateClientForm';
import LoginForm from './LoginForm';

type EditClient = {
    client: Client | null;
    isOpen: boolean;
}

const TablaClientes = () => {

    const [clients, setClients] = useState<Client[]>([] as Client[]);
    const [editClient, setEditClient] = useState<EditClient>({ client: null, isOpen: false });
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [userToken, setUserToken] = useState("");
    var [clientToUpdate,] = useState<Client | null>(null);
    
    const ip_laptop = '127.0.0.1';
    const ip_loop = '127.0.0.1';
    useEffect(() => {
        readClients();
        setIsLoginOpen(true);
    }, []);

    const readClients = async ()=>{
        await fetch(`http://${ip_laptop}:4200/client.api`)
            .then(res => res.json())
            .then((data) => {
                var newClients = [] as Client[];
                data.map((client : any) => {
                    newClients.push({
                        id: client._id, name: client.name,
                        gender: client.gender, age: client.age,
                        email: client.email
                    } as Client)
                })
                setClients([ ...newClients] as Client[])

            });
    }

    const deleteClient = async (client: Client) => {
        await fetch(`http://${ip_laptop}:4200/deleteClient/${client.id}`, {
            method: 'DELETE',
            headers : {
                'x-access-token': localStorage.getItem("token") + "",
                'Content-Type': 'application/json'
            },
        }).then(()=>console.log('good'));
        await readClients();
    }

    return (
        <div>
            {isLoginOpen&&<LoginForm setToken={setUserToken} onDone={setIsLoginOpen}></LoginForm>}
            <h1>
                Tabla Clientes
            </h1>
            <div className='row'>
                {

                    clients.map(
                        (user, i) => {
                            return (
                                <div className='card' style={{ width: '24rem' }} key={i}>
                                    <h1>
                                        {user.name}
                                    </h1>
                                    <h2>Genero: {user.gender}</h2>
                                    <h2>Correo: {user.email}</h2>
                                    <h2>Edad: {user.age}</h2>
                                    <div className='card-body'>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => { deleteClient(user) }}>
                                        Borrar
                                    </button>
                                    <br />
                                    {//Boton de editar
                                    }
                                    <button className="btn btn-primary" onClick={() => {
                                        setEditClient({ client: user, isOpen: true });

                                    }}>Editar</button>
                                    <br />
                                </div>
                            );
                        }
                    )
                }

            </div>
            <br />
            <AddClientForm onFinish={()=>{readClients()}} clients={clients} onSetClients={setClients}></AddClientForm>
            {!editClient.isOpen ? null : <UpdateClientForm onFinish={()=> readClients()} clients={clients} setClients={setClients} editClient={editClient} setEditClient={setEditClient}></UpdateClientForm>}
        </div>
    );
}

export default TablaClientes;

