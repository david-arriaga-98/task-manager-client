import { FC } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import FranchiseTable from '../Franchise/FranchiseTable';
import Charging from '../../components/State/Charging';
import Error from '../../components/State/Error';
import { useDispatch } from 'react-redux';
import Axios from '../../utils/axios';
import { ISuccessResponse } from '../../utils/managePetitions';
import { SHOW_NOTIFICATION } from '../../store/ducks/notification.duck';

type assignUserProps = {
	modal: boolean;
	fetchFranchise: any;
	toggle: () => void;
	reload: () => void;
	id: number;
};

const AssignUserToFranchise: FC<assignUserProps> = ({
	modal,
	toggle,
	reload,
	fetchFranchise,
	id
}) => {
	const dispatch = useDispatch();

	const assignToFranchise = async (franchiseId: number) => {
		try {
			const { data } = await Axios.put<ISuccessResponse<null>>(
				'/user/assingtofranchise',
				{
					userId: id.toString(),
					franchiseId: franchiseId.toString()
				}
			);
			toggle();
			reload();
			fetchFranchise.reload();
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
		<Modal isOpen={modal} toggle={toggle} size="lg">
			<ModalHeader toggle={toggle}>Escoja una franquicia</ModalHeader>
			<ModalBody>
				{fetchFranchise.dataState.isLoading ? (
					<Charging scope="franquicias" />
				) : fetchFranchise.dataState.isError ? (
					<Error error="Ha ocurrido un error al obtener las franquicias" />
				) : (
					<FranchiseTable
						select={true}
						dataState={fetchFranchise.dataState.data}
						reload={fetchFranchise.reload}
						action={assignToFranchise}
					/>
				)}
			</ModalBody>
		</Modal>
	);
};

export default AssignUserToFranchise;
