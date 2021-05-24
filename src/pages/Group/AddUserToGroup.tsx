import { format } from 'date-fns';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import Charging from '../../components/State/Charging';
import Error from '../../components/State/Error';
import useDataFetch from '../../Hooks/DataFetch';
import { IGetUsersForFranchiseAndGroup } from '../../models/User';
import { SHOW_NOTIFICATION } from '../../store/ducks/notification.duck';
import Axios from '../../utils/axios';
import { ISuccessResponse } from '../../utils/managePetitions';

type AddUserToGroupProps = {
	modal: boolean;
	groupId: number;
	toggle: () => void;
};

const AddUserToGroup: FC<AddUserToGroupProps> = ({
	modal,
	toggle,
	groupId
}) => {
	const { dataState, doFetch, reload } =
		useDataFetch<IGetUsersForFranchiseAndGroup[]>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useDispatch();

	const addUser = async (id: number) => {
		try {
			setIsLoading(true);
			const { data } = await Axios.post<ISuccessResponse<null>>(
				'/group/assign/user',
				{
					userId: id,
					groupId
				}
			);
			setIsLoading(false);
			reload();
			dispatch(
				SHOW_NOTIFICATION({
					message: data.message,
					type: 'success'
				})
			);
		} catch (error) {
			setIsLoading(false);
			dispatch(
				SHOW_NOTIFICATION({
					message: error.response.data.message,
					type: 'error'
				})
			);
		}
	};

	useEffect(() => {
		if (groupId !== 0) {
			doFetch('/franchise/' + groupId + '/users');
		}
		// eslint-disable-next-line
	}, [groupId]);

	return (
		<Modal isOpen={modal} toggle={toggle} size={'lg'}>
			<ModalHeader toggle={toggle}>Escoja los usuarios</ModalHeader>
			<ModalBody>
				<Table className="no-wrap v-middle" responsive>
					<thead>
						<tr className="border-0">
							<th>Nombres</th>
							<th>Usuario</th>
							<th>Esta agregado</th>
							<th>Fecha de creación</th>
						</tr>
					</thead>
					<tbody>
						{dataState.isLoading ? (
							<tr>
								<th>
									<Charging scope="usuarios" />
								</th>
							</tr>
						) : dataState.isError || dataState.data === undefined ? (
							<tr>
								<th className="text-center">
									<Error error="Ha ocurrido un error al obtener los usuarios" />
								</th>
							</tr>
						) : (
							dataState.data.map((value, key) => (
								<tr key={key}>
									<td>
										<p>{value.names}</p>
									</td>
									<td>
										<p>{value.username}</p>
									</td>
									<td>
										{/* eslint-disable-next-line*/}
										<p className={value.isJoinInGroup == 0 ? 'text-' : ''}>
											{/* eslint-disable-next-line*/}
											{value.isJoinInGroup == 0 ? 'No' : 'Si'}
										</p>
									</td>
									<td>
										<p>{format(new Date(value.createdAt), 'dd-MM-yyyy')}</p>
									</td>
									<td>
										{/* eslint-disable-next-line*/}
										{value.isJoinInGroup == 0 ? (
											<Button
												color="success"
												outline
												disabled={isLoading}
												onClick={() => addUser(value.id)}
											>
												<i className="mdi mdi-plus mr-1"></i>
												Agregar
											</Button>
										) : (
											<></>
										)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</Table>
			</ModalBody>
		</Modal>
	);
};

export default AddUserToGroup;
