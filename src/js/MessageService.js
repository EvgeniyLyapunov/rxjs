import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, catchError, of } from 'rxjs';

class MessageService {
	constructor(path) {
		this.path = path;
	}

	strim$() {
		return new Observable((observer) => {
			const interval = setInterval(() => {
				const request$ = ajax.getJSON(this.path).pipe(
					map((value) => {
						if (value.status === 'ok') {
							return value.messages;
						} else {
							return [];
						}
					}),
					catchError(() => {
						return of([]);
					})
				);

				request$.subscribe((value) => {
					observer.next(value);
				});
			}, 5000);

			return () => {
				clearInterval(interval);
			};
		});
	}
}

export default MessageService;
