import { FC } from 'react';

type ChargingProps = {
	scope: string;
};

const Charging: FC<ChargingProps> = ({ scope }) => {
	return <p className="text-center text-info">Cargando {scope} ...</p>;
};

export default Charging;
