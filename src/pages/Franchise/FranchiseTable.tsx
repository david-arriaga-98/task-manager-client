import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Table, Button } from 'reactstrap';
import { format } from 'date-fns';
import { IGetFranchise } from '../../models/Franchise';
import { SHOW_NOTIFICATION } from '../../store/ducks/notification.duck';
import Axios from '../../utils/axios';
import { ISuccessResponse } from '../../utils/managePetitions';

type franchiseTableProps = {
	select: boolean;
	dataState: IGetFranchise[];
	reload?: any;
	action?: any;
};

export const FranchiseTable: FC<franchiseTableProps> = ({
	select,
	action,
	dataState,
	reload
}) => {
	const dispatch = useDispatch();

	const deleteFranchise = async (id: number) => {
		try {
			const { data } = await Axios.delete<ISuccessResponse<null>>(
				'/franchise/' + id
			);
			reload();
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
		<Table className="no-wrap v-middle" responsive>
			<thead>
				<tr className="border-0">
					<th className="border-0">ID</th>
					<th className="border-0">Nombre</th>
					<th className="border-0">Razón Social</th>
					{!select ? (
						<>
							<th className="border-0">Usuarios</th>
							<th className="border-0">Grupos</th>
							<th className="border-0">Fecha de Creación</th>
							<th className="border-0">Acciones</th>
						</>
					) : (
						<></>
					)}
				</tr>
			</thead>
			<tbody>
				{dataState.map((value, key) => {
					return (
						<tr key={key}>
							<td className="blue-grey-text  text-darken-4 font-medium">
								{value.id}
							</td>
							<td>
								<p>{value.name}</p>
							</td>
							<td>
								<p>{value.socialReason}</p>
							</td>
							{!select ? (
								<>
									<td>
										<p>{value.users}</p>
									</td>

									<td>
										<p>{value.groups}</p>
									</td>

									<td>
										<p>
											{format(new Date(value.createdAt), 'dd-MM-yyyy HH:mm:ss')}
										</p>
									</td>
									<td>
										{/* eslint-disable-next-line*/}
										{value.groups == 0 && value.users == 0 ? (
											<Button
												color="danger"
												outline
												onClick={() => deleteFranchise(value.id)}
											>
												<i className="mdi mdi-delete mr-1"></i>
												Eliminar
											</Button>
										) : (
											<></>
										)}
									</td>
								</>
							) : (
								<td>
									<Button
										color="success"
										outline
										onClick={() => action(value.id)}
									>
										<i className="mdi mdi-check mr-1"></i>
										Escoger
									</Button>
								</td>
							)}
						</tr>
					);
				})}
			</tbody>
		</Table>
	);
};

export default FranchiseTable;
