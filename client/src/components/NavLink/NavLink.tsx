
type NavLinkProps = {
   icon: string,
   text: string,
   location: string
}

export default function NavLink(props: NavLinkProps) {

   return(
      <a className="navlink">
         <i className={`fa-solid ${props.icon}`}></i>
         <h2>{ props.text }</h2>
      </a>
   )
}