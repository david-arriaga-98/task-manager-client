import { useState } from 'react';
import { Card, CardBody, CardTitle, Button, Table } from 'reactstrap';
import useDataFetch from '../../Hooks/DataFetch';
import { IGetFranchise } from '../../models/Franchise';
import { IGetUser } from '../../models/User';
import CreateUser from './CreateUser';
import Charging from '../../components/State/Charging';
import Error from '../../components/State/Error';
import AssignUserToFranchise from './AssignUserToFranchise';
import Axios from '../../utils/axios';
import { ISuccessResponse } from '../../utils/managePetitions';
import { useDispatch } from 'react-redux';
import { SHOW_NOTIFICATION } from '../../store/ducks/notification.duck';

const User = () => {
	const fetchFranchise = useDataFetch<IGetFranchise[]>('/franchise/all');
	const fetchUser = useDataFetch<IGetUser[]>('/user');

	const [modalAssign, setModalAssign] = useState<boolean>(false);
	const toggleAssign = () => setModalAssign(!modalAssign);

	const [modal, setModal] = useState<boolean>(false);
	const toggle = () => setModal(!modal);

	const [id, setId] = useState<number>(0);

	const dispatch = useDispatch();

	const deleteUser = async (idUser: number) => {
		try {
			const { data } = await Axios.delete<ISuccessResponse<null>>(
				'/user/' + idUser
			);
			fetchUser.reload();
			dispatch(
				SHOW_NOTIFICATION({
					message: data.message,
					type: 'success'
				})
			);
		} catch (error) {
			dispatch(
				SHOW_NOTIFICATION({
					message: error.response.data.message,
					type: 'error'
				})
			);
		}
	};

	return (
		<>
			<Card>
				<CardTitle className="bg-light border-bottom p-3 mb-0">
					<i className="mdi mdi-account mr-2"> </i>
					Usuarios
				</CardTitle>
				<CardBody>
					<Button
						className="mb-3"
						color="info"
						onClick={toggle}
						disabled={fetchUser.dataState.isLoading}
					>
						<i className="mdi mdi-plus mr-1"></i>
						Agregar Usuario
					</Button>

					{fetchUser.dataState.isLoading ? (
						<Charging scope="usuarios" />
					) : fetchUser.dataState.isError ? (
						<Error error="Ha ocurrido un error al obtener los usuarios" />
					) : (
						<Table className="no-wrap v-middle" responsive>
							<thead>
								<tr className="border-0">
									<th className="border-0">ID</th>
									<th className="border-0">Nombres</th>
									<th className="border-0">Usuario</th>
									<th className="border-0">Rol</th>
									<th className="border-0">Franquicia</th>
									<th className="border-0">Asignar a Franquicia</th>
									<th className="border-0">Acciones</th>
								</tr>
							</thead>
							<tbody>
								{fetchUser.dataState?.data?.map((value, key) => {
									return (
										<tr key={key}>
											<td className="blue-grey-text  text-darken-4 font-medium">
												{value.id}
											</td>

											<td>
												<div className="d-flex no-block align-items-center">
													<div>
														<h5 className="mb-0 font-16 font-medium">
															{value.names}
														</h5>
														<span>{value.email}</span>
													</div>
												</div>
											</td>

											<td>
												<p>{value.username}</p>
											</td>

											<td>
												{value.role === 'ADMIN' ? (
													<p className="text-primary">Administrador</p>
												) : (
													<p className="text-info">Usuario</p>
												)}
											</td>

											<td>
												{value.franchise === null ? (
													<p className="text-danger">Sin Franquicia</p>
												) : (
													<p>{value.franchise.name}</p>
												)}
											</td>

											<td>
												{value.role !== 'ADMIN' && value.franchise === null ? (
													<Button
														color="info"
														outline
														disabled={fetchUser.dataState.isLoading}
														onClick={() => {
															setId(value.id);
															toggleAssign();
														}}
													>
														<i className="mdi mdi-check mr-1"></i>
														Asignar
													</Button>
												) : (
													<></>
												)}
											</td>

											<td>
												{value.role !== 'ADMIN' && value.franchise === null ? (
													<Button
														color="danger"
														outline
														disabled={fetchUser.dataState.isLoading}
														onClick={() => deleteUser(value.id)}
													>
														<i className="mdi mdi-delete mr-1"></i>
														Eliminar
													</Button>
												) : (
													<></>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					)}
				</CardBody>
			</Card>

			<AssignUserToFranchise
				modal={modalAssign}
				reload={fetchUser.reload}
				toggle={toggleAssign}
				fetchFranchise={fetchFranchise}
				id={id}
			/>
			<CreateUser modal={modal} reload={fetchUser.reload} toggle={toggle} />
		</>
	);
};

export default User;
