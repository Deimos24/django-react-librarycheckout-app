from rest_framework.filters import SearchFilter

class CustomSearchFilter(SearchFilter):
    def get_search_fields(self, view, request):
        """
        Allows searching across all fields when `search_field` is not provided.
        If `search_field` is specified, it searches only within that field.
        """
        search_field = request.query_params.get("search_field")
        if search_field:
            return [search_field]  # Limit search to one field
        return super().get_search_fields(view, request)  # Default: search across all fields