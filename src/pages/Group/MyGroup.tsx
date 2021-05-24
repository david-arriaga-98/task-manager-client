import { compareDesc, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import {
	Card,
	CardBody,
	CardTitle,
	Col,
	Row,
	Table,
	Button,
	UncontrolledTooltip
} from 'reactstrap';
import validator from 'validator';
import Charging from '../../components/State/Charging';
import Error from '../../components/State/Error';
import useDataFetch from '../../Hooks/DataFetch';
import { IGetGroupById } from '../../models/Group';
import { SHOW_NOTIFICATION } from '../../store/ducks/notification.duck';
import Axios from '../../utils/axios';
import { ISuccessResponse } from '../../utils/managePetitions';
import CreateTask from './CreateTask';
import ShowTaskInfo from './ShowTaskInfo';

const MyGroup = () => {
	let { id }: any = useParams();
	const [isValidId, setIsValidId] = useState<boolean>(false);
	const [modal, setModal] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentDate] = useState<Date>(new Date());

	const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

	const { dataState, doFetch, reload } = useDataFetch<IGetGroupById>();

	const [taskId, setTaskId] = useState<number>(0);

	const dispatch = useDispatch();

	useEffect(() => {
		const valId = !validator.isEmpty(id) && validator.isInt(id);
		if (valId) {
			setIsValidId(true);
			doFetch('/group/' + id);
		} else {
			setIsValidId(false);
		}
		// eslint-disable-next-line
	}, [id]);

	const joinToTask = async (taskId: number) => {
		try {
			setIsLoading(true);
			const { data } = await Axios.post<ISuccessResponse<null>>('/task/join', {
				taskId,
				groupId: dataState.data?.id
			});
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

	const toggle = () => setModal(!modal);
	const toggleShowInfo = () => setShowInfoModal(!showInfoModal);

	const completeTask = async (taskId: number) => {
		try {
			setIsLoading(true);
			const { data } = await Axios.post<ISuccessResponse<null>>(
				'/task/complete',
				{
					taskId
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

	return (
		<>
			{!isValidId ? (
				<Error error="El identificador ingresado, es inválido" />
			) : dataState.isLoading ? (
				<Charging scope="grupo" />
			) : dataState.isError || dataState.data === undefined ? (
				<Error error="Ha ocurrido un error al tratar de obtener los datos de este grupo" />
			) : (
				<>
					<Card>
						<CardTitle className="bg-light border-bottom p-3 mb-0">
							<i className="fa fa-object-group mr-2"> </i>
							{dataState.data.name}

							<i className="fa fa-sort-alpha-up ml-4 mr-2"></i>
							{dataState.data.description}

							<i className="fa fa-building ml-4 mr-2"></i>
							{dataState.data.franchiseName}
						</CardTitle>
						<CardBody>
							<Row>
								<Col xs="12" md="3">
									<Card body inverse color="info">
										<Row className="align-items-end">
											<Col md="4" className="text-center">
												<span>
													<i
														style={{
															fontSize: '3rem'
														}}
														className="mdi mdi-calendar-check"
													></i>
												</span>
											</Col>
											<Col className="text-left">
												<h4>{dataState.data?.totalTasks}</h4>
												<p>Tareas ingresadas</p>
											</Col>
										</Row>
									</Card>
								</Col>
								<Col xs="12" md="3">
									<Card body inverse color="success">
										<Row className="align-items-end">
											<Col md="4" className="text-center">
												<span>
													<i
														style={{
															fontSize: '3rem'
														}}
														className="mdi mdi-check"
													></i>
												</span>
											</Col>
											<Col md="8" className="text-left">
												<h4>
													{!dataState.data.completedTasks
														? 0
														: dataState.data.completedTasks}
												</h4>
												<p>
													{' '}
													{/* eslint-disable-next-line*/}
													{dataState.data.completedTasks == 1
														? 'Tarea Completada'
														: 'Tareas Completadas'}{' '}
												</p>
											</Col>
										</Row>
									</Card>
								</Col>
								<Col xs="12" md="3">
									<Card body inverse color="warning">
										<Row className="align-items-end">
											<Col md="4" className="text-center">
												<span>
													<i
														style={{
															fontSize: '3rem'
														}}
														className="mdi mdi-clock"
													></i>
												</span>
											</Col>
											<Col md="8" className="text-left">
												<h4>
													{!dataState.data.pendingTasks
														? 0
														: dataState.data.pendingTasks}
												</h4>
												<p>
													{/* eslint-disable-next-line*/}
													{dataState.data.pendingTasks == 1
														? 'Tarea Pendiente'
														: 'Tareas Pendientes'}
												</p>
											</Col>
										</Row>
									</Card>
								</Col>
								<Col xs="12" md="3">
									<Card body inverse color="danger">
										<Row className="align-items-end">
											<Col md="4" className="text-center">
												<span>
													<i
														style={{
															fontSize: '3rem'
														}}
														className="mdi mdi-close"
													></i>
												</span>
											</Col>
											<Col md="8" className="text-left">
												<h4>
													{!dataState.data.delayedTasks
														? 0
														: dataState.data.delayedTasks}
												</h4>
												<p>
													{/* eslint-disable-next-line*/}
													{dataState.data.delayedTasks == 1
														? 'Tarea Retrasada'
														: 'Tareas Retrasadas'}
												</p>
											</Col>
										</Row>
									</Card>
								</Col>
							</Row>
							<Row>
								<Col xs="12" md="12">
									<Button
										className="mb-3"
										color="info"
										onClick={toggle}
										disabled={isLoading}
									>
										<i className="mdi mdi-plus mr-1"></i>
										Agregar Tarea
									</Button>
								</Col>
								<Col xs="12" md="12">
									<Table className="no-wrap v-middle" responsive>
										<thead>
											<tr className="border-0">
												<th className="border-0">Nombre</th>
												<th className="border-0">Descripción</th>
												<th className="border-0">Estado</th>
												<th className="border-0">Usuarios</th>
												<th className="border-0">Fecha de finalización</th>
												<th className="border-0">Acciones</th>
											</tr>
										</thead>
										<tbody>
											{dataState.data?.tasks.map((value) => {
												return (
													<tr key={value.id}>
														<td>
															<p>{value.name}</p>
														</td>
														<td>
															<p>
																{value.description.length > 20
																	? value.description.substr(0, 20) + ' ...'
																	: value.description}
															</p>
														</td>
														<td>
															{value.status === 'COMPLETED' ? (
																<>
																	<UncontrolledTooltip
																		placement="top"
																		target={'completedTaskTooltip' + value.id}
																	>
																		Tarea completada
																	</UncontrolledTooltip>

																	<i
																		id={'completedTaskTooltip' + value.id}
																		className="fa fa-circle text-success"
																	></i>
																</>
															) : compareDesc(
																	currentDate,
																	new Date(value.endTask)
															  ) === 1 ? (
																<>
																	<UncontrolledTooltip
																		placement="top"
																		target={'inProccessTaskTooltip' + value.id}
																	>
																		Tarea en progreso
																	</UncontrolledTooltip>
																	<i
																		id={'inProccessTaskTooltip' + value.id}
																		className="fa fa-circle text-warning"
																	></i>
																</>
															) : (
																<>
																	<UncontrolledTooltip
																		placement="top"
																		target={'lateTaskTooltip' + value.id}
																	>
																		Tarea atrasada
																	</UncontrolledTooltip>
																	<i
																		id={'lateTaskTooltip' + value.id}
																		className="fa fa-circle text-danger"
																	></i>
																</>
															)}
														</td>
														<td>
															<p
																className={
																	/* eslint-disable-next-line*/
																	value.users == 0 ? 'text-danger' : 'text-info'
																}
															>
																{value.users}
															</p>
														</td>

														<td>
															<p>
																{format(
																	new Date(value.endTask),
																	'dd-MM-yyyy HH:mm:ss'
																)}
															</p>
														</td>
														<td>
															{/* eslint-disable-next-line*/}
															{value.isJoinInTask != 1 ? (
																<>
																	<UncontrolledTooltip
																		placement="top"
																		target={'joinTaskTooltip' + value.id}
																	>
																		Unirse a la tarea
																	</UncontrolledTooltip>
																	<i
																		id={'joinTaskTooltip' + value.id}
																		className="fa fa-plus text-info mr-2"
																		style={{
																			cursor: 'pointer'
																		}}
																		onClick={() => joinToTask(value.id)}
																	></i>
																</>
															) : (
																<></>
															)}

															{value.status !== 'COMPLETED' ? (
																<>
																	<UncontrolledTooltip
																		placement="top"
																		target={'completeTaskTooltip' + value.id}
																	>
																		Completar la tarea
																	</UncontrolledTooltip>
																	<i
																		id={'completeTaskTooltip' + value.id}
																		className="fa fa-check text-success mr-2"
																		style={{
																			fontSize: '18px',
																			cursor: 'pointer'
																		}}
																		onClick={() => completeTask(value.id)}
																	></i>
																</>
															) : (
																<></>
															)}

															<UncontrolledTooltip
																placement="top"
																target={'showTaskInformationTooltip' + value.id}
															>
																Ver información de la tarea
															</UncontrolledTooltip>

															<i
																onClick={() => {
																	setTaskId(value.id);
																	toggleShowInfo();
																}}
																id={'showTaskInformationTooltip' + value.id}
																className="fa fa-eye text-info"
																style={{
																	cursor: 'pointer'
																}}
															></i>
														</td>
													</tr>
												);
											})}
										</tbody>
									</Table>
								</Col>
							</Row>
						</CardBody>
					</Card>
					<ShowTaskInfo
						taskId={taskId}
						modal={showInfoModal}
						toggle={toggleShowInfo}
					/>
					<CreateTask
						modal={modal}
						toggle={toggle}
						reload={reload}
						groupId={dataState.data.id}
					/>
				</>
			)}
		</>
	);
};

export default MyGroup;
