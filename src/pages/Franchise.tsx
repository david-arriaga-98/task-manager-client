import { FC, useEffect, useState } from 'react';
import {
	Card,
	CardBody,
	CardTitle,
	Table,
	Input,
	Button,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
	FormGroup,
	Form,
	Label
} from 'reactstrap';
import { format } from 'date-fns';
import { executeServerPetition } from '../utils/managePetitions';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SHOW_NOTIFICATION } from '../store/ducks/notification.duck';
import { ICreateFranchise, IGetFranchise } from '../models/Franchise';

type franchiseTableProps = {
	select: boolean;
	action?: any;
	targetId?: number;
};

export const FranchiseTable: FC<franchiseTableProps> = ({ select, action }) => {
	const [franchises, setFranchises] = useState<IGetFranchise[]>([]);
	const [dataState, setDataState] = useState({
		isCharging: false,
		isError: false,
		message: '',
		loadData: true
	});
	const dispatch = useDispatch();

	useEffect(() => {
		getFranchises();
	}, [dataState.loadData]);

	const getFranchises = async () => {
		try {
			setDataState({
				...dataState,
				isCharging: true
			});
			const { data } = await executeServerPetition<undefined, IGetFranchise[]>(
				'GET',
				'/franchise/all'
			);
			setDataState({
				...dataState,
				isCharging: false
			});
			setFranchises(data);
		} catch (error) {
			dispatch(
				SHOW_NOTIFICATION({
					message: error.response.data.message,
					type: 'error'
				})
			);
			setDataState({
				...dataState,
				isCharging: false
			});
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
						</>
					) : (
						<></>
					)}
				</tr>
			</thead>
			<tbody>
				{franchises.map((value, key) => {
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

const Franchise = () => {
	const [modal, setModal] = useState<boolean>(false);
	const [dataState, setDataState] = useState({
		isCharging: false,
		isError: false,
		message: '',
		loadData: true
	});
	const dispatch = useDispatch();

	const {
		handleSubmit,
		register,
		formState: { errors }
	} = useForm();

	const toggle = () => setModal(!modal);

	const onSubmit = async (values: ICreateFranchise) => {
		try {
			setDataState({
				...dataState,
				isCharging: true
			});
			const { message } = await executeServerPetition<ICreateFranchise, null>(
				'POST',
				'/franchise',
				values
			);
			setDataState({
				...dataState,
				isCharging: true
			});
			// reloadData();
			toggle();
			dispatch(
				SHOW_NOTIFICATION({
					message: message,
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
			setDataState({
				...dataState,
				isCharging: false
			});
		}
	};

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
						disabled={dataState.isCharging}
					>
						<i className="mdi mdi-plus mr-1"></i>
						Agregar Franquicia
					</Button>

					<FranchiseTable select={false} />
				</CardBody>
			</Card>
			<Modal isOpen={modal} toggle={toggle}>
				<Form onSubmit={handleSubmit<ICreateFranchise>(onSubmit)}>
					<ModalHeader toggle={toggle}>Ingrese un usuario</ModalHeader>
					<ModalBody>
						<FormGroup>
							<Label for="name">Nombre de la franquicia</Label>
							<Input
								type="text"
								id="name"
								{...register('name', {
									required: {
										value: true,
										message: 'Este campo es requerido'
									},
									maxLength: {
										value: 100,
										message: 'Este campo debe tener máximo 100 carácteres'
									},
									minLength: {
										value: 5,
										message: 'Este campo debe tener mínimo 5 carácteres'
									}
								})}
							/>
							<span
								className="mt-1"
								style={{ fontSize: '12px', color: '#DC2626' }}
							>
								{errors.name && errors.name.message}
							</span>
						</FormGroup>

						<FormGroup>
							<Label for="socialReason">Razón Social</Label>
							<Input
								type="text"
								id="socialReason"
								{...register('socialReason', {
									required: {
										value: true,
										message: 'Este campo es requerido'
									},
									maxLength: {
										value: 220,
										message: 'Este campo debe tener máximo 220 carácteres'
									},
									minLength: {
										value: 3,
										message: 'Este campo debe tener mínimo 3 carácteres'
									}
								})}
							/>
							<span
								className="mt-1"
								style={{ fontSize: '12px', color: '#DC2626' }}
							>
								{errors.socialReason && errors.socialReason.message}
							</span>
						</FormGroup>
					</ModalBody>
					<ModalFooter>
						<Button color="info" type="submit" size="md">
							Crear franquicia
						</Button>
						<Button color="danger" size="md" onClick={toggle}>
							Cancelar
						</Button>
					</ModalFooter>
				</Form>
			</Modal>
		</>
	);
};

export default Franchise;
