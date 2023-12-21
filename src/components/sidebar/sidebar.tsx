import { Link } from "react-router-dom"
import "./sidebar.scss"

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="item">
                <span className="title">MAIN</span>
                <Link to="/instances" className="listItem">
                    <img src="/instance.svg" alt=""/>
                    <span className="listItemTitle">Instances</span>
                </Link>
                <Link to="/profiles" className="listItem">
                    <img src="/profile.svg" alt=""/>
                    <span className="listItemTitle">Profiles</span>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar