import { Row, Spinner } from "reactstrap"
import { ChatHeader, ContactHeader, Contacts, MessageForm, Messages } from "components"
import { Fragment, useEffect, useState } from "react"
import Auth from "Auth"
import { useNavigate } from "react-router-dom"
import io from "socket.io-client"

export default function Chat() {
    const navigate = useNavigate()
    const [connected, setConnected] = useState(false)
    const [user, setUser] = useState(null)
    const [messages, setMessages] = useState(null)
    const [contacts, setContacts] = useState(null)
    const [contact, setContact] = useState(null)
    const [socket, setSocket] = useState(null)
    
    useEffect(() => {
        initSocketConnection()
        return () => {
            socket.off('connect')
            socket.off('disconnect')
            socket.off('error')
            socket.off('data')
            socket.off('new_user')
            socket.off('message')
            socket.off('user_status')
        }
    }, [])
    
    function initSocketConnection() {
        let socket = io(process.env.REACT_APP_SOCKET, { query: 'token=' + Auth.getToken() })
        setSocket(socket)
        socket.on('connect', () => setConnected(true))
        socket.on('disconnect', () => setConnected(false))
        socket.on('error', err => {
            if(err === 'auth_error') {
                Auth.logout()
                navigate('/login')
            }
        })
        socket.on('data', (user, contacts, messages, users) => {
            setUser(user)
            setContacts(contacts)
            setMessages(messages)
            setContact(contacts[0])
        })
        socket.on('new_user', onNewUser)
        socket.on('message', onNewMessage)
        socket.on('user_status', updateUsersState)
    }
    
    function updateUsersState(statusId) {
        setContacts(prev => prev.map((contact) => {
                if(statusId[contact.id]) {contact.status = statusId[contact.id]}
                return contact
            })
        )
        setContact((prev) => {
            if (statusId[prev.id]) prev.status = statusId[prev.id]
            return prev
        })
    }

    function sendMessage(message) {
        if(!contact.id) return;
        message.receiver = contact.id
        socket.emit('message', message)
    }

    function onNewMessage(message) {
        setMessages((prev) => {console.log([...prev, message]); return [...prev, message]})
    }

    function onNewUser(user) {
        setContacts((prev) => [...prev, user])
    }

    function onChatNavigate(contact) {
        setContact(contact)
    }

    function renderChat() {
        if(!contact) return;
        
        return (
            <Fragment>
                <ChatHeader contact={contact} />
                <Messages user={user} messages={messages.filter(e => e.sender === contact.id || e.receiver === contact.id)} /> 
                <MessageForm sender={sendMessage}/>
            </Fragment>
        )
    }

    if(!connected || !user || !contacts || !messages) {
        return <Spinner id="loader" color="success" />
    }

    return (
        <Row className="h-100">
            <div id="contacts-section" className="col-6 col-md-4">
                <ContactHeader />
                <Contacts messages={messages} contacts={contacts} onChatNavigate={onChatNavigate} />
            </div>
            <div id="messages-section" className="col-6 col-md-8">
                {renderChat()}
            </div>
        </Row>
    )
}