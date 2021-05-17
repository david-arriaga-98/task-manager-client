import { FC } from 'react';
import Header from '../Header';
import Footer from '../Footer';

const NoSessionLayout: FC = ({ children }) => {
	return (
		<>
			<Header />
			<div className="page-wrapper d-block">
				<div className="page-content container-fluid">{children}</div>
				<Footer />
			</div>
		</>
	);
};

export default NoSessionLayout;
