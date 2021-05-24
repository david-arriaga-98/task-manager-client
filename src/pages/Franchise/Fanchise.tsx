import { FC, useState } from 'react';
import { Card, CardTitle, CardBody, Button } from 'reactstrap';
import Charging from '../../components/State/Charging';
import Error from '../../components/State/Error';
import useDataFetch from '../../Hooks/DataFetch';
import { IGetFranchise } from '../../models/Franchise';
import CreateFranchise from './CreateFranchise';
import { FranchiseTable } from './FranchiseTable';

const Fanchise: FC = () => {
	const { dataState, reload } = useDataFetch<IGetFranchise[]>('/franchise/all');

	const [modal, setModal] = useState<boolean>(false);
	const toggle = () => setModal(!modal);

	return (
		<>
			<Card>
				<CardTitle className="bg-light border-bottom p-3 mb-0">
					<i className="mdi mdi-home-modern mr-2"> </i>
					Franquicias
				</CardTitle>

				<CardBody>
					<Button
						className="mb-3"
						color="info"
						onClick={toggle}
						disabled={dataState.isLoading}
					>
						<i className="mdi mdi-plus mr-1"></i>
						Agregar Franquicia
					</Button>

					{dataState.isLoading ? (
						<Charging scope="franquicias" />
					) : dataState.isError || dataState.data === undefined ? (
						<Error error="Ha ocurrido un error al obtener las franquicias" />
					) : (
						<FranchiseTable
							select={false}
							dataState={dataState.data}
							reload={reload}
						/>
					)}
				</CardBody>
			</Card>
			<CreateFranchise modal={modal} toggle={toggle} reload={reload} />
		</>
	);
};

export default Fanchise;
