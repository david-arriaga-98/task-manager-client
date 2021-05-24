import { format } from 'date-fns';
import { FC, useEffect } from 'react';
import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Table
} from 'reactstrap';
import Charging from '../../components/State/Charging';
import Error from '../../components/State/Error';
import useDataFetch from '../../Hooks/DataFetch';
import { IGetUser } from '../../models/User';

type showTaskProps = {
	modal: boolean;
	taskId: number;
	toggle: () => void;
};

const ShowTaskInfo: FC<showTaskProps> = ({ modal, toggle, taskId }) => {
	const { dataState, doFetch } = useDataFetch<IGetUser[]>();

	useEffect(() => {
		if (taskId !== 0) {
			doFetch('/task/' + taskId + '/users');
		}

		/* eslint-disable-next-line*/
	}, [taskId]);

	return (
		<Modal isOpen={modal} toggle={toggle} size="lg">
			<ModalHeader toggle={toggle}>Usuario ingresados en la tarea</ModalHeader>
			<ModalBody>
				{dataState.isLoading ? (
					<Charging scope="usuarios" />
				) : dataState.isError || dataState.data === undefined ? (
					<Error error="Ha ocurrido un error al obtener los datos" />
				) : (
					<Table className="no-wrap v-middle" responsive>
						<thead>
							<tr className="border-0">
								<th className="border-0">Nombres</th>
								<th className="border-0">Nombre de usuario</th>
								<th className="border-0">Fecha de creación</th>
							</tr>
						</thead>
						<tbody>
							{dataState.data.map((value) => {
								return (
									<tr key={value.id}>
										<td>
											<p>{value.names}</p>
										</td>
										<td>
											<p>{value.username}</p>
										</td>

										<td>
											<p>
												{format(
													new Date(value.createdAt),
													'dd-MM-yyyy HH:mm:ss'
												)}
											</p>
										</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				)}
			</ModalBody>
			<ModalFooter>
				<Button color="danger" size="md" onClick={toggle}>
					Salir
				</Button>
			</ModalFooter>
		</Modal>
	);
};

export default ShowTaskInfo;
