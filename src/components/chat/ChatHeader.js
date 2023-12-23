import { Avatar } from "components";
import { Row, DropdownItem, DropdownMenu, DropdownToggle, Nav, UncontrolledDropdown} from "reactstrap";
import Auth from 'Auth'
import { useNavigate } from "react-router-dom";

const ChatHeader = props => {
    const navigate = useNavigate()

  const logout = () => {
    Auth.logout()
    navigate('/login')
  }

    return (
        <Row className="heading m-0">
            <div onClick={props.toggle}>
                <Avatar src={props.contact.avatar} />
            </div>
            <div className="text-right">
                <div>{props.contact ? props.contact.name : ''}</div>
           </div>
            <Nav className="mr-auto" navbar>
                <UncontrolledDropdown>
                    <DropdownToggle tag="a" className="nav-link">
                        <i className="fa fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={logout}>تسجيل الخروج</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        </Row>
    );
};

export default ChatHeader;