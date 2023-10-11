import {  notification } from "antd";

export function convertDate(date:Date): string
{   
    let day = date.getDate()<10?'0'+date.getDate():date.getDate()
    let month=(date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1
    return date.getFullYear()+'-'+month+'-'+day
}
export  const openNotification = (desc:string) => {
    notification.open({
      message: 'Уведомление',
      description: desc,
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
    });
  };

 