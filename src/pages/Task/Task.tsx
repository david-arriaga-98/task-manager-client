import { push } from 'connected-react-router';
import { compareDesc, format } from 'date-fns';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardBody, Row, Col, Button } from 'reactstrap';
import Charging from '../../components/State/Charging';
import Error from '../../components/State/Error';
import useDataFetch from '../../Hooks/DataFetch';
import { IGetTaskFromUser } from '../../models/Task';

const Task = () => {
	const [currentDate] = useState<Date>(new Date());
	const { dataState } = useDataFetch<IGetTaskFromUser[]>('/task/my');
	const dispatch = useDispatch();

	return (
		<Row className="justify-content-center">
			{dataState.isLoading ? (
				<Charging scope="tareas" />
			) : dataState.isError || dataState.data === undefined ? (
				<Error error="No se ha podido obtener las tarea" />
			) : (
				dataState.data.map((value, key) => {
					return (
						<Col sm={6} lg={4} key={key}>
							<Card>
								<CardBody>
									<div className="feed-widget">
										<ul className="list-style-none feed-body m-0 pb-3">
											<li>
												{value.status === 'COMPLETED' ? (
													<p className="text-success">Tarea completada</p>
												) : compareDesc(
														currentDate,
														new Date(value.endTask)
												  ) !== 1 ? (
													<p className="text-danger">Tarea retrasada</p>
												) : (
													<p className="text-warning">Tarea en progreso</p>
												)}
											</li>
											<li>
												<h2>{value.name}</h2>
											</li>
											<li className="mt-3">
												<p>
													{value.description.length > 50
														? value.description.substr(0, 50) + ' ...'
														: value.description}
												</p>
											</li>
											<li className="d-flex justify-content-start mt-3 mb-3">
												<span className="font-12 text-muted">
													<i className="mdi mdi-timer mr-1"></i>
													{format(
														new Date(value.endTask),
														'dd-MM-yyyy hh:mm:ss'
													)}
												</span>
											</li>
											<li>
												<Button
													onClick={() =>
														dispatch(push('/groups/' + value.groupId))
													}
													color={
														value.status === 'COMPLETED'
															? 'success'
															: compareDesc(
																	currentDate,
																	new Date(value.endTask)
															  ) === 1
															? 'warning'
															: 'danger'
													}
												>
													<i className="fa fa-chevron-right mr-2"></i>
													Ir al grupo
												</Button>
											</li>
										</ul>
									</div>
								</CardBody>
							</Card>
						</Col>
					);
				})
			)}
		</Row>
	);
};

export default Task;
