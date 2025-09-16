class NotFoundException(Exception):
    
    def __init__(self, itme_type: str, item_id:int):
        self.item_type = itme_type
        self.item_id = item_id
        super().__init__(f" {itme_type} with id {item_id} not found")

class AlreadyExistsException(Exception):

    def __init__(self, item_type: str, item_id: int):
        self.item_type = item_type
        self.item_id = item_id
        super().__init__(f"{item_type} with id {item_id} already exists")