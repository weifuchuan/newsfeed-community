import { observable } from 'mobx';
import Ret, { IRet } from './Ret';
import { POST_FORM } from '@/kit/req';

export interface IMessage {
	id: number;
	content: string;
	fromId: number;
	toId: number;
	createAt: number;
}

export default class Message implements IMessage {
	@observable id: number = 0;
	@observable content: string = '';
	@observable fromId: number = 0;
	@observable toId: number = 0;
	@observable createAt: number = 0;

	static from(newsfeed: IMessage): Message {
		const ns = new Message();
		for (let key in newsfeed) {
			ns[key] = newsfeed[key];
		}
		return ns;
	}

	static async paginate(
		toId: number,
		p: number = 1
	): Promise<{
		messages: Message[];
		totalPage: number;
		pageNumber: number;
	}> {
		const ret: IRet = (await POST_FORM('/message', { toId, p })).data;
		return {
			messages: ret.messages.map(Message.from),
			totalPage: ret.totalPage,
			pageNumber: ret.pageNumber
		};
	}

	static async send(toId: number, content: string, createAt: number): Promise<Ret> {
		const ret: IRet = (await POST_FORM('/message/send', { toId, content, createAt })).data;
		if (ret.state === 'ok') {
			return Ret.ok().set('id', ret.id);
		} else {
			return Ret.fail().set('msg', '发送失败');
		}
	}
}
