import { FC } from 'react';

type ErrorProps = {
	error: string;
};

const Error: FC<ErrorProps> = ({ error }) => {
	return <p className="text-center text-danger">{error}</p>;
};

export default Error;
