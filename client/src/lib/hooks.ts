import { notification } from "antd";

type NotificationType = 'success' | 'info' | 'warning' | 'error';
const UseOwnNotification=()=>{
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type: NotificationType,title:string, desc:string) => {
      api[type]({
        message: title,
        description:desc,
      });
    };
    return {openNotificationWithIcon,contextHolder}
}
export default UseOwnNotification
