import {
	Card,
	CardImg,
	CardText,
	CardBody,
	CardTitle,
	CardSubtitle,
	Button,
	Row,
	Col
} from 'reactstrap';

import img1 from '../assets/images/big/img1.jpg';
import img2 from '../assets/images/big/img2.jpg';
import img3 from '../assets/images/big/img3.jpg';

const Dashboard = () => {
	return (
		<>
			<Row>
				<Col sm={6} lg={8}>
					<h1>adsaddsa</h1>
				</Col>
				<Col sm={6} lg={4}>
					<h1>adsaddsa</h1>
				</Col>
			</Row>
			<Row>
				<Col sm={12}>
					<h1>adsaddsa</h1>
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="4">
					{/*--------------------------------------------------------------------------------*/}
					{/*Card-1*/}
					{/*--------------------------------------------------------------------------------*/}
					<Card>
						<CardImg top width="100%" src={img1} />
						<CardBody>
							<CardTitle>Card title</CardTitle>
							<CardSubtitle>Card subtitle</CardSubtitle>
							<CardText>
								Some quick example text to build on the card title and make up
								the bulk of the card's content.
							</CardText>
							<Button>Button</Button>
						</CardBody>
					</Card>
				</Col>
				<Col xs="12" md="4">
					{/*--------------------------------------------------------------------------------*/}
					{/*Card-1*/}
					{/*--------------------------------------------------------------------------------*/}
					<Card>
						<CardImg top width="100%" src={img2} />
						<CardBody>
							<CardTitle>Card title</CardTitle>
							<CardSubtitle>Card subtitle</CardSubtitle>
							<CardText>
								Some quick example text to build on the card title and make up
								the bulk of the card's content.
							</CardText>
							<Button>Button</Button>
						</CardBody>
					</Card>
				</Col>
				<Col xs="12" md="4">
					{/*--------------------------------------------------------------------------------*/}
					{/*Card-1*/}
					{/*--------------------------------------------------------------------------------*/}
					<Card>
						<CardImg top width="100%" src={img3} />
						<CardBody>
							<CardTitle>Card title</CardTitle>
							<CardSubtitle>Card subtitle</CardSubtitle>
							<CardText>
								Some quick example text to build on the card title and make up
								the bulk of the card's content.
							</CardText>
							<Button>Button</Button>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default Dashboard;
