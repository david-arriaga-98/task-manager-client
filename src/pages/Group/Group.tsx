import { FC, useEffect, useState } from 'react';
import {
	Card,
	CardBody,
	Row,
	Col,
	Button,
	Modal,
	Form,
	ModalBody,
	ModalHeader,
	ModalFooter,
	Input,
	Label,
	FormGroup
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { ICreateGroup, IGetGroup } from '../../models/Group';
import { executeServerPetition } from '../../utils/managePetitions';
import { useDispatch, useSelector } from 'react-redux';
import { SHOW_NOTIFICATION } from '../../store/ducks/notification.duck';
import { IApplicationState } from '../../store/ducks';
import { IUserState } from '../../store/ducks/user.duck';
import { format } from 'date-fns';
import { push } from 'connected-react-router';
import AddUserToGroup from './AddUserToGroup';

const Group = () => {
	const [groups, setGroups] = useState<IGetGroup[]>([]);
	const [dataState, setDataState] = useState({
		isCharging: false,
		isError: false,
		message: '',
		loadData: true
	});

	const state = useSelector<IApplicationState, IUserState>(
		(state) => state.user
	);

	const [modal, setModal] = useState({
		createGroupModal: false,
		addUserToGroup: false
	});

	const [groupSelected, setGroupSelected] = useState<number>(0);

	const dispatch = useDispatch();

	useEffect(() => {
		getGroups();
		// eslint-disable-next-line
	}, []);

	const getGroups = async () => {
		try {
			setDataState({
				...dataState,
				isCharging: true
			});
			const { data } = await executeServerPetition<undefined, IGetGroup[]>(
				'GET',
				'/group/my'
			);
			setDataState({
				...dataState,
				isCharging: false
			});
			setGroups(data);
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

	const toggleAddUser = () =>
		setModal({ ...modal, addUserToGroup: !modal.addUserToGroup });
	const toggleCreate = () =>
		setModal({ ...modal, createGroupModal: !modal.createGroupModal });

	return (
		<>
			<Row>
				<Col>
					<Button className="mb-4" color="info" onClick={toggleCreate}>
						<i className="mdi mdi-plus mr-1"></i>
						Crear Grupo
					</Button>
				</Col>
			</Row>
			<Row>
				{groups.map((data, key) => {
					return (
						<Col sm={6} lg={4} key={key}>
							<Card>
								<CardBody>
									<div className="feed-widget mb-3">
										<ul className="list-style-none feed-body m-0 pb-3">
											{data.ownerId === state.userData?.id ? (
												<p className="text-info">Administrador</p>
											) : (
												<p className="text-success">Miembro</p>
											)}

											<li>
												<h2>{data.name}</h2>
											</li>

											<li className="mt-4">
												<p>
													{data.description.length > 50
														? data.description.substr(0, 50) + ' ...'
														: data.description}
												</p>
											</li>

											<li className="d-flex justify-content-between mt-4">
												<span className="font-12 text-muted">
													<i className="mdi mdi-account mr-1"></i>
													{data.ownerName}
												</span>
												<span className="font-12 text-muted">
													<i className="mdi mdi-timer mr-1"></i>
													{format(new Date(data.createdAt), 'dd-MM-yyyy')}
												</span>
											</li>
										</ul>
									</div>
									{data.ownerId === state.userData?.id ? (
										<Button
											className="mr-2"
											color="info"
											onClick={() => {
												setGroupSelected(data.id);
												toggleAddUser();
											}}
										>
											<i className="mdi mdi-plus mr-1"></i>
											Agregar Usuarios
										</Button>
									) : (
										<></>
									)}

									<Button
										color="success"
										onClick={() => dispatch(push('/groups/' + data.id))}
									>
										<i className="mdi mdi-eye mr-1"></i>
										Ver grupo
									</Button>
								</CardBody>
							</Card>
						</Col>
					);
				})}
			</Row>
			<AddUserToGroup
				groupId={groupSelected}
				modal={modal.addUserToGroup}
				toggle={toggleAddUser}
			/>
			<CreateGroupModal
				action={toggleCreate}
				status={modal.createGroupModal}
				reload={getGroups}
			/>
		</>
	);
};

type createGroupModalProps = {
	status: boolean;
	action: any;
	reload: any;
};

const CreateGroupModal: FC<createGroupModalProps> = ({
	status,
	action,
	reload
}) => {
	const {
		handleSubmit,
		register,
		formState: { errors },
		reset
	} = useForm();

	const [dataState, setDataState] = useState({
		isCharging: false,
		isError: false,
		message: '',
		loadData: true
	});

	const dispatch = useDispatch();

	const onSubmit = async (values: ICreateGroup) => {
		try {
			setDataState({
				...dataState,
				isCharging: true
			});
			const { message } = await executeServerPetition<ICreateGroup, null>(
				'POST',
				'/group',
				values
			);
			setDataState({
				...dataState,
				isCharging: true
			});
			reload();
			action();
			reset();
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
		<Modal isOpen={status} toggle={action}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<ModalHeader toggle={action}>Crear un grupo</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Label for="name">Nombre</Label>
						<Input
							type="text"
							id="name"
							{...register('name', {
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
							{errors.name && errors.name.message}
						</span>
					</FormGroup>

					<FormGroup>
						<Label for="description">Descripción</Label>
						<Input
							type="textarea"
							id="description"
							rows="3"
							{...register('description', {
								required: {
									value: true,
									message: 'Este campo es requerido'
								},
								maxLength: {
									value: 225,
									message: 'Este campo debe tener máximo 225 carácteres'
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
							{errors.description && errors.description.message}
						</span>
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<Button color="info" type="submit" size="md">
						Crear grupo
					</Button>
					<Button color="danger" size="md" onClick={action}>
						Cancelar
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
};

export default Group;
