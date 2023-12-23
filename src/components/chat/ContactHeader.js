import { Avatar } from "components";
import { Row } from 'reactstrap';

const ContactHeader = props => (
  <Row className="heading">
    <Avatar />
    <div>جهات الاتصال</div>
  </Row>
)

export default ContactHeader