import { Navigate } from "react-router-dom";

// const AppRoute = ({component: Component, can = () => true, redirect, ...rest}) => {
//   console.log(Component)
//   return (
//   <Route {...rest} render = {(props) => {
//     console.log(props) 
//     return(
//     can() ? <Component {...props} /> : <Navigate to={redirect} />
//   )}} />
// )}

const AppRoute = ({children, can, to}) => {
  const able = can()
  
  return able ? children : <Navigate to={to} />
}

export default AppRoute