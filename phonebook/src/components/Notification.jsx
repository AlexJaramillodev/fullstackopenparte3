const Notification = ({message, type}) =>{
    if(message === null){
        return null
    }
    return (
        <div className={ type === 'exito' ? 'exito' : 'error'}>
            {message}
        </div>
    )
}

export default Notification;