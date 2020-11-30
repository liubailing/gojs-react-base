/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';
import { observer } from 'mobx-react';
import Flowchart from '../flowchart/flowchartDiagram';
import Workflow from './workflowHandle';
import './base.css';
/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
@observer
class WorkflowTest extends React.Component<{}> {
	componentDidMount() {
		Workflow.test('init');
	}

	render() {
		return (
			<>
				<div id="div-Main">
					<div className="div-flowchart">
						<Flowchart taskId="taskId" flowchart={Workflow.flowchart}></Flowchart>
					</div>
					<div className="div-logs">
						<ul>
							{Workflow.logs.reverse().map((x, i) => {
								return (
									<li className={'div-log-item'} key={x + i}>
										{x}
									</li>
								);
							})}
						</ul>
					</div>
				</div>

				<div className="divActions">
					<div id="div-actions" className="divActionItem" style={{ marginTop: '5px' }}>
						<div>
							<label>初始：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('init');
								}}
							>
								初始化
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('getall');
								}}
							>
								得到全部
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								重新渲染
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								复杂模型
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('hide_contextMenu');
								}}
							>
								清除contextMenu
							</button>
						</div>

						<div>
							<label>存取数据：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('set_data');
								}}
							>
								第一个节点存储Data
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('get_data');
								}}
							>
								取出Data
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('set_data_1');
								}}
							>
								修改Data
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('get_data');
								}}
							>
								再取出Data
							</button>
						</div>
					</div>

					<div className="divActionItem">
						<div>
							<label>追加节点：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('add_smiple');
								}}
							>
								新增节点
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('add_loop');
								}}
							>
								新增循环
							</button>
						</div>

						<div>
							<button
								onClick={() => {
									Workflow.test('add_condition');
								}}
							>
								新增条件判断
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('add_pre');
								}}
							>
								往前追加
							</button>
						</div>

						<div>
							{' '}
							<div className="divActionItem">
								<div>
									<label>内部尾部：</label>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('add_inner_cond');
										}}
									>
										新增一个条件分支
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('add_inner_loop');
										}}
									>
										循环追加一个节点
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('add_inner_branch');
										}}
									>
										分支追加一个节点
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('add_inner_loop_tail');
										}}
									>
										为循环追加打开网页
									</button>
								</div>
							</div>
						</div>

						<div>
							{' '}
							<div className="divActionItem">
								<div>
									<label>内部头部：</label>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('add_inner_cond_header');
										}}
									>
										追加到条件
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('add_inner_loop_header');
										}}
									>
										追加到循环
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('add_cond_loop');
										}}
									>
										套入循环
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="divActionItem">
						<div>
							<label>删除节点：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('delete_data');
								}}
							>
								删除节点
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('delete_loop2');
								}}
							>
								删除节点 循环
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('delete_branch');
								}}
							>
								删除节点 条件分支2
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('delete_cond');
								}}
							>
								删除节点 条件
							</button>
						</div>
						<div>
							<label>复制节点：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('copy_cond');
								}}
							>
								复制cond一次
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('copy_cond2');
								}}
							>
								复制cond多次
							</button>
						</div>

						<div>
							<button
								onClick={() => {
									Workflow.test('paste_to_loop');
								}}
							>
								粘贴到loop
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('copy_paste');
								}}
							>
								复制cond到loop
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('copy_paste2');
								}}
							>
								复制cond到openJD
							</button>
						</div>
					</div>
					<div className="divActionItem">
						<div>
							<label>选中节点：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('sel_node');
								}}
							>
								选中openJD
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('sel_loop');
								}}
							>
								选中 循环
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('sel_branch2');
								}}
							>
								选中 条件分支2
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('sel_cond');
								}}
							>
								选中 条件
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('sel_node_only');
								}}
							>
								选中openJD ,但不触发click
							</button>
						</div>
					</div>
					<div className="divActionItem">
						<div>
							<label>重命名：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('rename');
								}}
							>
								重命名openJD
							</button>
						</div>
						<div>
							{' '}
							<div className="divActionItem">
								<div>
									<label>获取结点：</label>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('get_node');
										}}
									>
										获取openJD
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('get_cond');
										}}
									>
										获取条件
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default WorkflowTest;
