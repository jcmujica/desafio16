import { useState, useEffect, useContext } from 'react'
import { Layout } from 'components/Layout';
import io from "socket.io-client";
import { useNavigate } from 'react-router';
import { AuthContext } from 'contexts/authContext';

const initialMessageForm = {
    message: '',
    name: '',
    alias: '',
    avatar: '',
    age: '',
    date: '',
    email: '',
    lastName: '',
};

const initialProductForm = {
    name: '',
    price: '',
    thumbnail: '',
};

export const Home = () => {
    let socket = null;
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [products, setProducts] = useState([]);
    const [productForm, setProductForm] = useState(initialProductForm);
    const [messageForm, setMessageForm] = useState(initialMessageForm);
    const { user } = useContext(AuthContext);

    const submitProduct = async (e) => {
        e.preventDefault();
        socket.emit('submitProduct', productForm);
        setProductForm(initialProductForm);
    };

    const submitMessage = async (e) => {
        e.preventDefault();
        const date = new Date();
        const formattedMessageForm = {
            author: {
                age: messageForm.age,
                alias: messageForm.alias,
                avatar: messageForm.avatar,
                date: date.toLocaleString('en-GB'),
                id: messageForm.email,
                lastName: messageForm.lastName,
                name: messageForm.name,
            },
            text: messageForm.message,
        };
        socket.emit('submitMessage', formattedMessageForm);
        setMessageForm(initialMessageForm);
    };

    const handleMessageChange = (e) => {
        setMessageForm({
            ...messageForm,
            [e.target.name]: e.target.value
        });
    };

    const handleProductChange = (e) => {
        setProductForm({
            ...productForm,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        socket = io({ protocols: ["http"] });
        const getMessages = async () => {
            socket.on('listMessages', (msgs) => {
                console.log("listMessages", msgs);
                setMessages(msgs);
            });
        };

        const getProducts = async () => {
            socket.on('listProducts', (prods) => {
                setProducts(prods);
            });
        };

        getMessages();
        getProducts();
    }, []);

    if (user?.error) {
        navigate('/login');
    };

    return (
        <Layout>
            <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                <div className="flex">
                    <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20">
                        <path
                            d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg></div>
                    <div className="flex justify-between items-center w-full">
                        <p className="font-bold">Bienvenido {user?.username || ''}</p>
                    </div>
                </div>
            </div>
            <div className="flex min-h-screen h-full" onSubmit={submitProduct}>
                <div className="w-full h-full flex flex-col items-center bg-slate-50 pt-10">
                    <h1 className="font-bold text-3xl mb-10">Ingrese Producto</h1>
                    <div>
                        <form className="w-full max-w-lg p-6">
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                                        Nombre
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        type="text"
                                        name="name"
                                        value={productForm.name}
                                        onChange={handleProductChange}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="price">
                                        Precio
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        type="text"
                                        name="price"
                                        value={productForm.price}
                                        onChange={handleProductChange}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full px-3">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="image">
                                        Foto URL
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        type="text"
                                        placeholder="https://"
                                        name="thumbnail"
                                        value={productForm.thumbnail}
                                        onChange={handleProductChange}
                                    />
                                </div>
                            </div>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={submitProduct}
                            >
                                Enviar
                            </button>
                        </form>
                    </div>
                    <h1 className="font-bold text-3xl mb-10">Chat</h1>
                    <div className="w-full max-w-lg p-6">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="firstName">
                                    Nombre
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    name="name"
                                    value={messageForm.name}
                                    onChange={handleMessageChange}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lastName">
                                    Apellido
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    name="lastName"
                                    value={messageForm.lastName}
                                    onChange={handleMessageChange}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="age">
                                    Edad
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    name="age"
                                    value={messageForm.age}
                                    onChange={handleMessageChange}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="alias">
                                    Alias
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    name="alias"
                                    value={messageForm.alias}
                                    onChange={handleMessageChange}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="avatar">
                                    Avatar
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    name="avatar"
                                    value={messageForm.avatar}
                                    onChange={handleMessageChange}
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    name="email"
                                    value={messageForm.email}
                                    onChange={handleMessageChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="message">
                                    Mensaje
                                </label>
                                <div className="flex">
                                    <input
                                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 rounded-r-none"
                                        type="text"
                                        name="message"
                                        value={messageForm.message}
                                        onChange={handleMessageChange}
                                    />
                                    <button
                                        className="bg-blue-500 h-max hover:bg-blue-700 text-white font-bold py-2 px-4 rounded rounded-l-none mb-3"
                                        onClick={submitMessage}
                                    >
                                        Enviar
                                    </button>
                                </div>
                                <div className="w-full text-red-700 hidden" id="error">
                                    Debe completar todos los campos para enviar un mensaje!
                                </div>
                                <div id="chatbox" className="mt-12 min-h-16 w-full bg-white py-3 px-4 mb-3 text-left">
                                    {messages.map((message, index) => (
                                        <p key={"message-" + index}>
                                            <span className="font-bold text-blue-500">{message?.author?.alias}</span>
                                            <span className="font-bold text-stone-500 text-xs">{message?.author?.date}</span>:
                                            <span className="text-gray-700 italic">{message.text}</span>
                                        </p>
                                    ))}
                                    <span className="block sm:inline">No hay mas mensajes.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full min-h-screen h-full flex flex-col items-center pt-10">
                    <h1 className="font-bold text-3xl mb-10">Productos</h1>
                    <table className="table-auto mb-16">
                        <thead>
                            <tr>
                                <th className="px-4 py-1">Nombre</th>
                                <th className="px-4 py-1">Precio</th>
                                <th className="px-4 py-1">Foto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={"product-" + index}>
                                    <td className="border px-4 py-1">{product.name}</td>
                                    <td className="border px-4 py-1">{product.price}</td>
                                    <td className="border px-4 py-1">
                                        <img className='w-20 h-20 rounded-full' src={product.thumbnail} alt={product.name} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        products?.length <= 0 &&
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative z-0" role="alert">
                            <strong className="font-bold">Ups!</strong>
                            <span className="block sm:inline">No hay productos.</span>
                        </div>
                    }
                </div>
            </div>
        </Layout>
    )
}
