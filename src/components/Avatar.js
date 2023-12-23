import avatar from 'assets/avatar.png'

const Avatar = props => {
  return <img src={props.src ? props.src : avatar} className='img-fluid rounded-circle ml-3 avatar' alt='' />
}

export default Avatar