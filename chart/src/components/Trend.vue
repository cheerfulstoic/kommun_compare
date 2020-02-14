<script>
import { Line } from 'vue-chartjs'

export default {
  props: ['data', 'options'],
  mixins: [Line],
  mounted () {
    this.renderChart(this.data, this.options)
  },
  watch: {
    data () {
      this.renderChart(this.data, this.options)
    }
  }
}
</script>

<style>
</style>
