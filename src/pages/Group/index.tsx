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

const Group = () => {
	const [groups, setGroups] = useState<IGetGroup[]>([]);
	const [dataState, setDataState] = useState({
		isCharging: false,
		isError: false,
		message: '',
		loadData: true
	});
	const dispatch = useDispatch();

	const state = useSelector<IApplicationState, IUserState>(
		(state) => state.user
	);

	const [modal, setModal] = useState({
		createGroupModal: false
	});

	useEffect(() => {
		getGroups();
		// eslint-disable-next-line
	}, [dataState.loadData]);

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
											<li>
												<h2>{data.name}</h2>
											</li>

											<li className="mt-4">
												<p>{data.description.substr(0, 120) + '...'}</p>
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
										<Button className="mr-2" color="info">
											<i className="mdi mdi-pencil mr-1"></i>
											Administrar
										</Button>
									) : (
										<></>
									)}

									<Button color="success">
										<i className="mdi mdi-eye mr-1"></i>
										Revisar
									</Button>
								</CardBody>
							</Card>
						</Col>
					);
				})}
			</Row>
			<CreateGroupModal action={toggleCreate} status={modal.createGroupModal} />
		</>
	);
};

type createGroupModalProps = {
	status: boolean;
	action: any;
};

const CreateGroupModal: FC<createGroupModalProps> = ({ status, action }) => {
	const {
		handleSubmit,
		register,
		formState: { errors }
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
			// reloadData();
			action();
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
						<Label for="name">Nombre del grupo</Label>
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
						<Label for="description">Descripción del grupo</Label>
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
