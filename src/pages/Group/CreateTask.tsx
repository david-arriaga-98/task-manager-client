import { FC, useState } from 'react';
import {
	Button,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { compareAsc } from 'date-fns';
import { ICreateTask } from '../../models/Task';
import { useDispatch } from 'react-redux';
import { SHOW_NOTIFICATION } from '../../store/ducks/notification.duck';
import Axios from '../../utils/axios';
import { ISuccessResponse } from '../../utils/managePetitions';

type createTaskProps = {
	modal: boolean;
	groupId: number;
	toggle: () => void;
	reload: () => void;
};

const CreateTask: FC<createTaskProps> = ({
	modal,
	reload,
	toggle,
	groupId
}) => {
	const {
		reset,
		register,
		formState: { errors },
		handleSubmit,
		setError
	} = useForm();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentDate] = useState<Date>(new Date());

	const dispatch = useDispatch();

	const getDate = () => {
		var local = new Date();
		local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
		return local.toJSON().slice(0, 16);
	};

	const onSubmit = async (values: ICreateTask) => {
		try {
			values.endTaskDate = new Date(values.endTaskDate);
			values.groupId = groupId;

			if (compareAsc(values.endTaskDate, currentDate) === 1) {
				setIsLoading(true);
				const { data } = await Axios.post<ISuccessResponse<null>>(
					'/task',
					values
				);
				setIsLoading(false);
				reload();
				reset();
				toggle();
				dispatch(
					SHOW_NOTIFICATION({
						message: data.message,
						type: 'success'
					})
				);
			} else {
				setError('date', {
					type: 'validate',
					message: 'No puedes crear tareas en el pasado'
				});
			}
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

	return (
		<Modal isOpen={modal} toggle={toggle}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<ModalHeader toggle={toggle}>Ingresar tareas</ModalHeader>
				<ModalBody>
					<Row>
						<Col>
							<FormGroup>
								<Label for="name">Nombre</Label>
								<Input
									disabled={isLoading}
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
						</Col>

						<Col>
							<FormGroup>
								<Label for="endTaskDate">Finalización</Label>
								<Input
									{...register('endTaskDate', {
										required: {
											value: true,
											message: 'Este campo es requerido'
										}
									})}
									min={getDate()}
									type="datetime-local"
									id="endTaskDate"
								/>
								<span
									className="mt-1"
									style={{ fontSize: '12px', color: '#DC2626' }}
								>
									{errors.endTaskDate && errors.endTaskDate.message}
								</span>
							</FormGroup>
						</Col>
					</Row>

					<FormGroup>
						<Label for="description">Descripción</Label>
						<Input
							disabled={isLoading}
							rows="3"
							type="textarea"
							id="description"
							{...register('description', {
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
							{errors.description && errors.description.message}
						</span>
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<Button color="info" type="submit" size="md" disabled={isLoading}>
						Crear tarea
					</Button>
					<Button
						color="danger"
						size="md"
						onClick={toggle}
						disabled={isLoading}
					>
						Cancelar
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
};

export default CreateTask;
