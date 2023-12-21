import "./navbar.scss"

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">
                <img src="logo.svg" alt=""/>
                <span>AutoClashBot</span>
            </div>
            <div className="icons">
                <img src="/settings.svg" alt="" className="icon"/>
            </div>
        </div>
    )
}

export default Navbar