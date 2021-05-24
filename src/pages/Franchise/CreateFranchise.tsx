import { FC, useState } from 'react';
import {
	Modal,
	ModalBody,
	ModalHeader,
	FormGroup,
	Label,
	Input,
	Form,
	ModalFooter,
	Button
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { ICreateFranchise } from '../../models/Franchise';
import Axios from '../../utils/axios';
import { ISuccessResponse } from '../../utils/managePetitions';
import { SHOW_NOTIFICATION } from '../../store/ducks/notification.duck';
import React from 'react';

type createFranchiseProps = {
	modal: boolean;
	toggle: () => void;
	reload: () => void;
};

const CreateFranchise: FC<createFranchiseProps> = ({
	modal,
	toggle,
	reload
}) => {
	const {
		handleSubmit,
		register,
		formState: { errors },
		reset
	} = useForm();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useDispatch();

	const onSubmit = async (values: ICreateFranchise) => {
		try {
			setIsLoading(true);
			const { data } = await Axios.post<ISuccessResponse<null>>(
				'/franchise',
				values
			);
			setIsLoading(false);
			reset();
			toggle();
			dispatch(
				SHOW_NOTIFICATION({
					message: data.message,
					type: 'success'
				})
			);
			reload();
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
			<Form onSubmit={handleSubmit<ICreateFranchise>(onSubmit)}>
				<ModalHeader toggle={toggle}>Ingrese un usuario</ModalHeader>
				<ModalBody>
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

					<FormGroup>
						<Label for="socialReason">Razón Social</Label>
						<Input
							disabled={isLoading}
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
					<Button color="info" type="submit" size="md" disabled={isLoading}>
						Crear franquicia
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

export default React.memo(CreateFranchise);
