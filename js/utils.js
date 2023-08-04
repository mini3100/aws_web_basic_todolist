class DateUtils {
    static leftPad(value) {
        if(value >= 10) {
            return value;
        }

        return `0${value}`; //10이하인 경우 앞에 0 붙여줌
    }

    static toStringByFormatting(date) {
        const year = date.getFullYear();
        const month = this.leftPad(date.getMonth() + 1);  //js는 0부터 1월
        const day = this.leftPad(date.getDate());

        return [year, month, day].join("-");    //배열로 만들어서 -로 이어붙이기
    }
}