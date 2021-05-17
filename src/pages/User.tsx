import { useEffect, useState } from 'react';
import {
	Row,
	Col,
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
import { IGetUser, IRegister } from '../models/User';
import { executeServerPetition } from '../utils/managePetitions';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SHOW_NOTIFICATION } from '../store/ducks/notification.duck';
import { FranchiseTable } from './Franchise';

const User = () => {
	const [modal, setModal] = useState<boolean>(false);
	const [assignModal, setAssignModal] = useState<boolean>(false);
	const [id, setId] = useState<number>();

	const [users, setUsers] = useState<IGetUser[]>([]);
	const [dataState, setDataState] = useState({
		isCharging: false,
		isError: false,
		message: '',
		loadData: true
	});
	const dispatch = useDispatch();

	useEffect(() => {
		getUsers();
		// eslint-disable-next-line
	}, [dataState.loadData]);

	const {
		handleSubmit,
		register,
		formState: { errors },
		watch
	} = useForm();

	const reloadData = () => {
		setDataState({
			...dataState,
			loadData: !dataState.loadData
		});
	};

	const toggle = () => setModal(!modal);
	const toggleAssign = () => setAssignModal(!assignModal);

	const getUsers = async () => {
		try {
			setDataState({
				...dataState,
				isCharging: true
			});
			const { data } = await executeServerPetition<undefined, IGetUser[]>(
				'GET',
				'/user'
			);
			setDataState({
				...dataState,
				isCharging: false
			});
			setUsers(data);
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

	const onSubmit = async (values: IRegister) => {
		try {
			setDataState({
				...dataState,
				isCharging: true
			});
			const { message } = await executeServerPetition<IRegister, null>(
				'POST',
				'/user/register',
				{
					...values,
					role: values.role === 'Administrador' ? 'ADMIN' : 'USER'
				}
			);
			setDataState({
				...dataState,
				isCharging: true
			});
			reloadData();
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

	const deleteUser = async (id: number) => {
		try {
			setDataState({
				...dataState,
				isCharging: true
			});
			const { message } = await executeServerPetition('DELETE', '/user/' + id);
			setDataState({
				...dataState,
				isCharging: false
			});
			reloadData();
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

	const assignToFranchise = async (franchiseId: number) => {
		try {
			setDataState({
				...dataState,
				isCharging: true
			});
			const { message } = await executeServerPetition(
				'PUT',
				'/user/assingtofranchise',
				{
					userId: id?.toString(),
					franchiseId: franchiseId.toString()
				}
			);
			toggleAssign();
			setDataState({
				...dataState,
				isCharging: false
			});
			reloadData();
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
					<i className="mdi mdi-account mr-2"> </i>
					Usuarios
				</CardTitle>
				<CardBody>
					<Button
						className="mb-3"
						color="info"
						onClick={toggle}
						disabled={dataState.isCharging}
					>
						<i className="mdi mdi-plus mr-1"></i>
						Agregar Usuario
					</Button>
					<Table className="no-wrap v-middle" responsive>
						<thead>
							<tr className="border-0">
								<th className="border-0">ID</th>
								<th className="border-0">Nombres</th>
								<th className="border-0">Usuario</th>
								<th className="border-0">Rol</th>
								<th className="border-0">Franquicia</th>
								<th className="border-0">Asignar a Franquicia</th>
							</tr>
						</thead>
						<tbody>
							{users.map((value, key) => {
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
													disabled={dataState.isCharging}
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
													onClick={() => deleteUser(value.id)}
													disabled={dataState.isCharging}
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
				</CardBody>
			</Card>

			<Modal isOpen={assignModal} toggle={toggleAssign} size="lg">
				<ModalHeader toggle={toggleAssign}>Escoja una franquicia</ModalHeader>
				<ModalBody>
					<FranchiseTable select={true} action={assignToFranchise} />
				</ModalBody>
			</Modal>

			<Modal isOpen={modal} toggle={toggle}>
				<Form onSubmit={handleSubmit<IRegister>(onSubmit)}>
					<ModalHeader toggle={toggle}>Ingrese un usuario</ModalHeader>
					<ModalBody>
						<FormGroup>
							<Label for="names">Nombres</Label>
							<Input
								type="text"
								id="names"
								{...register('names', {
									required: {
										value: true,
										message: 'Este campo es requerido'
									},
									maxLength: {
										value: 80,
										message: 'Este campo debe tener máximo 80 carácteres'
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
								{errors.names && errors.names.message}
							</span>
						</FormGroup>

						<Row>
							<Col>
								<FormGroup>
									<Label for="username">Usuario</Label>
									<Input
										type="text"
										id="username"
										{...register('username', {
											required: {
												value: true,
												message: 'Este campo es requerido'
											},
											maxLength: {
												value: 20,
												message: 'Este campo debe tener máximo 20 carácteres'
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
										{errors.username && errors.username.message}
									</span>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label for="role">Rol</Label>
									<Input {...register('role')} type="select" id="role">
										<option>Usuario</option>
										<option>Administrador</option>
									</Input>
									<span
										className="mt-1"
										style={{ fontSize: '12px', color: '#DC2626' }}
									>
										{errors.role && errors.role.message}
									</span>
								</FormGroup>
							</Col>
						</Row>

						<FormGroup>
							<Label for="email">Correo electrónico</Label>
							<Input
								type="text"
								id="email"
								{...register('email', {
									required: {
										value: true,
										message: 'Este campo es requerido'
									},
									pattern: {
										value:
											/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
										message: 'Este correo tiene un formato inválido'
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
								{errors.email && errors.email.message}
							</span>
						</FormGroup>

						<Row>
							<Col>
								<FormGroup>
									<Label for="password">Contraseña:</Label>
									<Input
										type="password"
										id="password"
										{...register('password', {
											required: {
												value: true,
												message: 'Este campo es requerido'
											},
											maxLength: {
												value: 90,
												message: 'Este campo debe tener máximo 90 carácteres'
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
										{errors.password && errors.password.message}
									</span>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup>
									<Label for="passwordConfirm">Contraseña:</Label>
									<Input
										type="password"
										id="passwordConfirm"
										{...register('passwordConfirm', {
											required: {
												value: true,
												message: 'Este campo es requerido'
											},
											maxLength: {
												value: 90,
												message: 'Este campo debe tener máximo 90 carácteres'
											},
											minLength: {
												value: 5,
												message: 'Este campo debe tener mínimo 5 carácteres'
											},
											validate: (value) =>
												value === watch('password') ||
												'Las contraseñas no coinciden'
										})}
									/>
									<span
										className="mt-1"
										style={{ fontSize: '12px', color: '#DC2626' }}
									>
										{errors.passwordConfirm && errors.passwordConfirm.message}
									</span>
								</FormGroup>
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button color="info" type="submit" size="md">
							Registrar usuario
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

export default User;
