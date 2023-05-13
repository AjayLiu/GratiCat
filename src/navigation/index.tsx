import UserStack from "./userStack";
import AuthStack from "./authStack";
import { useUser } from "@utils/hooks/useUser";

export default function RootNavigation() {
	const { isSignedIn } = useUser();

	if (!isSignedIn) {
		return <AuthStack />;
	}
	return <UserStack />;
}
