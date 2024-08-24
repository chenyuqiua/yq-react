import { Action } from 'shared/ReactType';

export interface Update<State> {
	action: Action<State>;
}

export type SharedQueue<State> = {
	pending: Update<State> | null;
};

export interface UpdateQueue<State> {
	shared: SharedQueue<State>;
}

export function createUpdate<State>(action: Action<State>): Update<State> {
	return {
		action
	};
}

export function createUpdateQueue<State>(): UpdateQueue<State> {
	return {
		shared: {
			pending: null
		}
	};
}

// 插入
export function enqueueUpdate<State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) {
	updateQueue.shared.pending = update;
}

// 消费
export function processUpdateQueue<State>(
	baseUpdate: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseUpdate
	};

	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			result.memoizedState = action(baseUpdate);
		} else {
			result.memoizedState = action;
		}
	}

	return result;
}
