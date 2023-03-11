class ServerAddress{ 
    //ip_laptop = '192.168.1.6';
    ip_laptop = '127.0.0.1'
    backend_port = '4200';
    ip_loop = '127.0.0.1';
    full_address = this.ip_laptop + ":" + this.backend_port;
}

const _ServerAddress = new ServerAddress();
export default _ServerAddress;