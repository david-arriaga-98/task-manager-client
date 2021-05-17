import CryptoJS from 'crypto-js';
import { addMinutes, getUnixTime } from 'date-fns';
import validator from 'validator';
import { IUser } from '../models/User';

const dataKey: number = 0xa2055f;

const valueElements: string[] = ['rmx', 'lsx'];

export const currentUser = () => {
	try {
		const rmx = localStorage.getItem(valueElements[0]);
		const lsx = localStorage.getItem(valueElements[1]);

		if (rmx === null || lsx === null) {
			throw new Error('Invalid data');
		} else {
			const user = decryptData(rmx);

			let valUser = !validator.isEmpty(user) && validator.isJSON(user);

			if (valUser) {
				let myUser: IUser = JSON.parse(user) as IUser;

				let valToken =
					!validator.isEmpty(myUser.token) && validator.isJWT(myUser.token);
				let valTime = !validator.isEmpty(lsx) && validator.isNumeric(lsx);

				if (valToken && valTime) {
					const actualDate: number = getUnixTime(new Date());

					if (parseInt(lsx) - actualDate > 1) {
						console.log(parseInt(lsx) - actualDate);
						return myUser;
					}
				}
			}
		}
		throw new Error('Invalid data');
	} catch (error) {
		logOut();
	}
};

export const encryptData = (data: IUser) => {
	if (data) {
		localStorage.setItem(
			valueElements[0],
			encryptElement(JSON.stringify(data))
		);
		localStorage.setItem(
			valueElements[1],
			getUnixTime(addMinutes(new Date(), 30)).toString()
		);
	}
};

const encryptElement = (value: string): string => {
	return CryptoJS.AES.encrypt(value, dataKey.toString()).toString();
};

const decryptData = (value: string): string => {
	let bytes = CryptoJS.AES.decrypt(value, dataKey.toString());
	return bytes.toString(CryptoJS.enc.Utf8);
};

export const logOut = () => {
	for (const value of valueElements) {
		localStorage.removeItem(value);
	}
};
