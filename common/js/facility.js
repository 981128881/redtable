export const getOption = number => {
	let arr = [];
	for (let i = 0; i < 17; i++) {
		arr.push(number & Math.pow(2, i));
	}
	return arr;
};